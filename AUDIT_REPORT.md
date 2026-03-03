# Auditoría de Seguridad y Casos de Borde - Memory App

**Fecha:** 2026-03-03  
**Versión:** 1.0.0  
**Estado:** Producción Ready con Recomendaciones

---

## Resumen Ejecutivo

✅ **Estado General:** La aplicación está bien estructurada con buenas prácticas de TypeScript y programación funcional.  
⚠️ **Hallazgos Críticos:** 2 problemas que requieren atención inmediata  
📋 **Recomendaciones:** 8 mejoras sugeridas para robustez en producción

---

## 1. Análisis del Flujo de Datos del Juego

### 1.1 API Service (`rickmorty.api.ts`)

#### ✅ Fortalezas
- Validación robusta de respuestas con type guards
- Retry mechanism con backoff exponencial (500ms * attempt)
- Manejo específico de error 429 (rate limiting)
- Validación de cantidad mínima de personajes (PAIR_COUNT)

#### ⚠️ PROBLEMA CRÍTICO #1: Infinite Loop Potencial
**Ubicación:** `generateRandomIds()` línea 10-15

```typescript
export const generateRandomIds = (count: number, max: number): number[] => {
  const ids = new Set<number>();
  while (ids.size < count) {  // ⚠️ PELIGRO: Loop infinito si count > max
    ids.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(ids);
};
```

**Caso de Borde:**
- Si `count > max`, el loop nunca termina
- Actualmente: `count=9`, `max=826` ✅ OK
- Pero si PAIR_COUNT aumenta a >826, la app se congela

**Impacto:** 🔴 CRÍTICO - Congelamiento total de la aplicación

**Fix Requerido:**
```typescript
export const generateRandomIds = (count: number, max: number): number[] => {
  if (count > max) {
    throw new Error(`Cannot generate ${count} unique IDs from range [1, ${max}]`);
  }
  const ids = new Set<number>();
  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(ids);
};
```

#### 📋 Recomendación #1: Timeout en fetchWithRetry
**Problema:** No hay timeout en las peticiones fetch  
**Riesgo:** Usuario esperando indefinidamente si el API no responde

**Sugerencia:**
```typescript
const fetchWithRetry = async (url: string, attempts: number): Promise<Response> => {
  const TIMEOUT_MS = 10000; // 10 segundos
  let lastError: Error = new Error(GAME_MESSAGES.API.ERROR);
  
  for (let i = 0; i < attempts; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
      
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (res.status === 429) throw new Error(GAME_MESSAGES.API.TOO_MANY_REQUESTS);
      if (!res.ok) throw new Error(`${GAME_MESSAGES.API.ERROR}: HTTP ${res.status}`);
      return res;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(GAME_MESSAGES.API.ERROR);
      if (i < attempts - 1) await new Promise<void>((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw lastError;
};
```

---

## 2. Análisis del Store (useGameStore)

### 2.1 Race Conditions

#### ⚠️ PROBLEMA CRÍTICO #2: Race Condition en initGame
**Ubicación:** `initGame()` línea 64-70

```typescript
setTimeout(() => {
  const faceDown: Card[] = get().cards.map((c) => ({
    ...c,
    isFlipped: false,
  }));
  set((prev) => ({ ...prev, cards: faceDown, gameStatus: 'playing' }));
}, GAME_CONFIG.PREVIEW_DELAY_MS);
```

**Caso de Borde:**
1. Usuario inicia juego (setTimeout programado para 3s)
2. Usuario hace click en "Jugar de nuevo" a los 2s
3. `resetGame()` llama a `initGame()` nuevamente
4. Ahora hay 2 timeouts activos
5. El primer timeout se ejecuta y sobrescribe el estado del nuevo juego

**Impacto:** 🔴 CRÍTICO - Estado inconsistente, juego roto

**Fix Requerido:**
```typescript
// Agregar al estado inicial
const initialState = {
  // ... existing state
  previewTimeoutId: null as NodeJS.Timeout | null,
};

// En initGame
initGame: async () => {
  // Cancelar timeout anterior si existe
  const currentTimeoutId = get().previewTimeoutId;
  if (currentTimeoutId) {
    clearTimeout(currentTimeoutId);
  }
  
  set((prev) => ({ ...prev, ...initialState, isLoading: true, gameStatus: 'initializing' }));

  const ids = generateCharacterIds();
  const response = await fetchCharacters(ids);

  if (!response.success || !response.data) {
    set((prev) => ({
      ...prev,
      isLoading: false,
      error: response.error ?? 'Error desconocido',
      gameStatus: 'idle',
      previewTimeoutId: null,
    }));
    return;
  }

  const rawCards = createCards(response.data);
  const shuffled = shuffleCards(rawCards);
  const faceUp: Card[] = shuffled.map((c) => ({ ...c, isFlipped: true }));

  set((prev) => ({
    ...prev,
    cards: faceUp,
    isLoading: false,
    gameStatus: 'showing',
  }));

  // Guardar el ID del timeout
  const timeoutId = setTimeout(() => {
    const faceDown: Card[] = get().cards.map((c) => ({
      ...c,
      isFlipped: false,
    }));
    set((prev) => ({ ...prev, cards: faceDown, gameStatus: 'playing', previewTimeoutId: null }));
  }, GAME_CONFIG.PREVIEW_DELAY_MS);
  
  set((prev) => ({ ...prev, previewTimeoutId: timeoutId }));
},
```

#### 📋 Recomendación #2: Race Condition en evaluateMatch
**Problema:** Similar al anterior, el timeout en `flipCard` (línea 107-109) no se cancela

**Escenario:**
1. Usuario selecciona 2 cards (timeout de 1s programado)
2. Usuario hace click en "Jugar de nuevo" antes de que termine el timeout
3. El timeout se ejecuta con estado obsoleto

**Sugerencia:** Implementar sistema similar de tracking de timeouts

---

## 3. Validación de Datos

### 3.1 API Response Validation

#### ✅ Fortalezas
- Type guard `isValidCharacter` valida estructura completa
- Verifica tipos y longitud de strings
- Filtra caracteres inválidos antes de usarlos

#### 📋 Recomendación #3: Validar URLs de imágenes
**Problema:** No se valida que `image` sea una URL válida

**Sugerencia:**
```typescript
const isValidImageUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const isValidCharacter = (data: unknown): data is RickMortyCharacter => {
  if (!data || typeof data !== 'object') return false;
  const char = data as Record<string, unknown>;
  return (
    typeof char.id === 'number' &&
    typeof char.name === 'string' &&
    typeof char.image === 'string' &&
    char.name.length > 0 &&
    char.image.length > 0 &&
    isValidImageUrl(char.image) // ✅ Nueva validación
  );
};
```

---

## 4. Autenticación y Persistencia

### 4.1 Storage Utils

#### ✅ Fortalezas
- Type guard `isUser` para validar datos deserializados
- Try-catch en todas las operaciones de localStorage
- Limpieza automática de datos inválidos
- Logging de errores para debugging

#### 📋 Recomendación #4: Validar expiración de tokens
**Problema:** No hay validación de expiración de tokens JWT

**Sugerencia:**
```typescript
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
  } catch {
    return true; // Si no se puede parsear, considerarlo expirado
  }
};

export const getToken = (): string | null => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    
    if (isTokenExpired(token)) {
      console.warn('Token expired, removing from storage');
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};
```

### 4.2 Auth Store

#### ⚠️ Advertencia: Error Handling en OAuth
**Ubicación:** `loginWithOAuthCallback()` línea 87-105

**Problema:** Si `oauthUserToUser()` lanza error, no se maneja

**Sugerencia:**
```typescript
loginWithOAuthCallback: async () => {
  set((prev) => ({ ...prev, isLoading: true, error: null }));
  
  try {
    const result = await handleOAuthCallback();

    const nextState = result.success
      ? (() => {
        const user = oauthUserToUser(result.data);
        saveToken(result.data.session.accessToken);
        saveUser(user);
        showToast(AUTH_MESSAGES.LOGIN.SUCCESS, 'success');
        return { user, isAuthenticated: true, isLoading: false, error: null };
      })()
      : (() => {
        showToast(result.error, 'error');
        return { isLoading: false, error: result.error };
      })();

    set((prev) => ({ ...prev, ...nextState }));
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error en OAuth';
    set((prev) => ({ ...prev, isLoading: false, error: errorMsg }));
    showToast(errorMsg, 'error');
  }
},
```

---

## 5. Casos de Borde Específicos del Juego

### 5.1 Clicks Rápidos en Cards

#### ✅ Protección Existente
```typescript
if (gameStatus !== 'playing' || isEvaluating || card.isMatched || card.isFlipped) return;
if (firstCard && firstCard.cardId === card.cardId) return;
```

**Casos cubiertos:**
- ✅ Click en card ya volteada
- ✅ Click en card ya emparejada
- ✅ Click en la misma card dos veces
- ✅ Click durante evaluación

### 5.2 API Failures

#### ✅ Manejo Correcto
- Retry con backoff
- Estado de error mostrado al usuario
- Botón "Reintentar" funcional
- No crash de la aplicación

---

## 6. Accesibilidad y UX

### 6.1 Estados de Carga

#### ✅ Implementado
- Spinner durante carga inicial
- Mensaje de estado "Cargando personajes..."
- Aria-live regions para screen readers
- Estados de error accesibles

#### 📋 Recomendación #5: Skeleton Loading
**Sugerencia:** Mostrar skeleton de 18 cards durante carga para mejor UX

### 6.2 Keyboard Navigation

#### 📋 Recomendación #6: Mejorar navegación por teclado
**Problema:** Cards tienen `onKeyDown` pero no hay indicador visual de focus claro en todas las cards

**Verificar:** CSS de `:focus-visible` en todas las cards

---

## 7. Performance

### 7.1 Re-renders

#### ✅ Optimizaciones Existentes
- `useCallback` en handlers de `useGameBoard`
- Zustand con selectores específicos
- Componentes funcionales puros

#### 📋 Recomendación #7: Memoizar CardsGrid
**Sugerencia:**
```typescript
export const CardsGrid: React.FC<CardsGridProps> = React.memo(
  ({ cards, onCardClick }) => (
    <section className="cards-grid" aria-label="Tablero de juego" role="grid">
      {cards.map((card) => (
        <CardComponent key={card.cardId} card={card} onClick={onCardClick} />
      ))}
    </section>
  )
);
```

### 7.2 Image Loading

#### 📋 Recomendación #8: Preload de imágenes
**Problema:** Las imágenes se cargan cuando se voltean las cards

**Sugerencia:**
```typescript
// En initGame, después de crear las cards
const imageUrls = shuffled.map(c => c.image);
imageUrls.forEach(url => {
  const img = new Image();
  img.src = url;
});
```

---

## 8. Testing Coverage

### 8.1 Estado Actual

#### ✅ Tests Existentes (51/51 pasando)
- ✅ Funciones puras (game.utils.test.ts)
- ✅ Componentes (Card, CardsGrid, GameStats, VictoryModal)
- ✅ API service (rickmorty.api.test.ts)

#### 📋 Tests Faltantes
- ❌ useGameStore (race conditions, timeouts)
- ❌ useGameBoard hook
- ❌ Integración completa del flujo de juego
- ❌ Auth store y OAuth flow

---

## 9. Priorización de Fixes

### 🔴 CRÍTICO (Implementar ANTES de producción)
1. **Fix #1:** Validación en `generateRandomIds()` para evitar infinite loop
2. **Fix #2:** Cancelación de timeouts en `initGame()` y `flipCard()`

### 🟡 IMPORTANTE (Implementar en próximo sprint)
3. Timeout en peticiones fetch
4. Validación de expiración de tokens JWT
5. Error handling en OAuth callback

### 🟢 MEJORAS (Nice to have)
6. Validación de URLs de imágenes
7. Skeleton loading state
8. Preload de imágenes
9. Memoización de componentes
10. Tests adicionales para stores

---

## 10. Checklist de Producción

### Antes de Deploy
- [ ] Implementar Fix #1 (generateRandomIds validation)
- [ ] Implementar Fix #2 (timeout cancellation)
- [ ] Agregar timeout a fetch requests
- [ ] Validar expiración de tokens
- [ ] Revisar error handling en OAuth
- [ ] Ejecutar suite completa de tests
- [ ] Test manual de casos de borde documentados
- [ ] Verificar accesibilidad con screen reader
- [ ] Test de performance con DevTools
- [ ] Verificar responsive en mobile/tablet/desktop

### Monitoreo Post-Deploy
- [ ] Configurar error tracking (Sentry/LogRocket)
- [ ] Monitorear tasa de errores de API
- [ ] Tracking de timeouts y retries
- [ ] Analytics de flujo de usuario

---

## Conclusión

La aplicación tiene una base sólida con buenas prácticas de TypeScript y programación funcional. Los 2 problemas críticos identificados son fáciles de resolver y deben implementarse antes de producción.

**Nivel de Riesgo Actual:** 🟡 MEDIO  
**Nivel de Riesgo Post-Fixes:** 🟢 BAJO

**Recomendación:** Implementar los 2 fixes críticos y proceder a producción. Las mejoras adicionales pueden implementarse iterativamente.
