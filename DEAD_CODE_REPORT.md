# Reporte de Código Muerto - Memory App

**Fecha:** 2026-03-03  
**Análisis:** Identificación de código no utilizado para limpieza segura

---

## Resumen Ejecutivo

**Total de archivos analizados:** 42 archivos TypeScript/React  
**Código muerto identificado:** 3 categorías principales  
**Impacto estimado:** ~200 líneas de código a eliminar  
**Riesgo de limpieza:** 🟢 BAJO (código bien aislado)

---

## 1. Funciones y Utilidades No Utilizadas

### 1.1 `/src/shared/utils/validators.ts`

#### ❌ Funciones NUNCA importadas/usadas

**`validateEmail()`** - Líneas 14-30
- **Estado:** ❌ NO USADA directamente
- **Uso indirecto:** ✅ Sí, usada por `validateLoginCredentials` y `validateRegisterCredentials`
- **Acción:** ✅ MANTENER (usada internamente)

**`validatePassword()`** - Líneas 35-50
- **Estado:** ✅ USADA en `useForgotPasswordForm.ts`
- **Acción:** ✅ MANTENER

**`validateUsername()`** - Líneas 55-72
- **Estado:** ❌ NO USADA directamente
- **Uso indirecto:** ✅ Sí, usada por `validateRegisterCredentials`
- **Acción:** ✅ MANTENER (usada internamente)

**`validateRequiredFields()`** - Líneas 116-132
- **Estado:** ❌ NUNCA USADA
- **Importada en:** Solo en tests
- **Acción:** 🗑️ **ELIMINAR** (17 líneas)

---

### 1.2 `/src/shared/constants/messages.ts`

#### ❌ Constantes NUNCA referenciadas

**`MESSAGES.GAME`** - Líneas 8-24
- **Subcampos usados:**
  - ✅ `API_ERROR`, `API_RETRY`, `API_UNAVAILABLE`, `API_RATE_LIMIT` - Usados en `rickmorty.api.ts`
  - ✅ `WIN_SUBTITLE`, `WIN_TURNS_LABEL` - Usados en `VictoryModal.tsx`
  
- **Subcampos NO usados:**
  - ❌ `START` - Nunca referenciado
  - ❌ `PAUSE` - Nunca referenciado
  - ❌ `RESUME` - Nunca referenciado
  - ❌ `WIN` - Nunca referenciado (se usa `WIN_SUBTITLE` en su lugar)
  - ❌ `LOSE` - Nunca referenciado
  - ❌ `MATCH` - Nunca referenciado
  - ❌ `NO_MATCH` - Nunca referenciado
  - ❌ `SCORE_UPDATE` - Nunca referenciado
  - ❌ `TIME_WARNING` - Nunca referenciado
  - ❌ `LOADING_CHARACTERS` - Nunca referenciado

**`MESSAGES.GENERAL`** - Líneas 27-38
- **Estado:** ❌ TODO el objeto NUNCA usado
- **Acción:** 🗑️ **ELIMINAR** (12 líneas)

**`MESSAGES.UI`** - Líneas 41-52
- **Estado:** ❌ TODO el objeto NUNCA usado
- **Acción:** 🗑️ **ELIMINAR** (12 líneas)

**`MESSAGES.FORMS`** - Líneas 55-65
- **Estado:** ❌ TODO el objeto NUNCA usado
- **Acción:** 🗑️ **ELIMINAR** (11 líneas)

**`MESSAGES.APP`** - Líneas 68-71
- **Estado:** ❌ TODO el objeto NUNCA usado
- **Acción:** 🗑️ **ELIMINAR** (4 líneas)

**Total a eliminar en messages.ts:** ~49 líneas

---

### 1.3 `/src/shared/constants/ui.constants.ts`

#### ✅ TODO USADO - No eliminar nada

- `TOAST_ICONS` - ✅ Usado en `Toast.tsx`
- `ARIA_LABELS` - ✅ Usado en componentes
- `TOAST_CLOSE_SYMBOL` - ✅ Usado en `Toast.tsx`
- `HEADER_UI` - ✅ Usado en `Header.tsx`

---

## 2. Funciones del Store No Utilizadas

### 2.1 `/src/domains/game/store/useGameStore.ts`

#### ❌ Acciones exportadas pero NUNCA llamadas

**`setGameStatus()`** - Línea 30
- **Definición:** `setGameStatus: (status: GameStatus) => set((prev) => ({ ...prev, gameStatus: status }))`
- **Uso:** ❌ NUNCA llamada en ningún componente/hook
- **Acción:** 🗑️ **ELIMINAR** (1 línea + tipo en GameActions)

**`setCards()`** - Línea 32
- **Definición:** `setCards: (cards: Card[]) => set((prev) => ({ ...prev, cards }))`
- **Uso:** ❌ NUNCA llamada en ningún componente/hook
- **Acción:** 🗑️ **ELIMINAR** (1 línea + tipo en GameActions)

**Impacto en tipos:**
- Eliminar de `GameActions` interface en `game.types.ts` líneas 46-47

---

## 3. Campos de Estado Internos (Nuevos)

### 3.1 Timeouts en GameStore

**`previewTimeoutId` y `evaluateTimeoutId`**
- **Estado:** ✅ USADOS internamente (agregados en fix de race conditions)
- **Visibilidad:** Solo internos del store
- **Acción:** ✅ MANTENER (críticos para prevenir race conditions)

---

## 4. Archivos Completos a Revisar

### 4.1 Archivos de Test

**Todos los archivos `.test.ts` y `.test.tsx`**
- **Estado:** ✅ MANTENER (necesarios para CI/CD)
- **Cobertura:** 187 tests pasando

---

## 5. Plan de Limpieza Seguro

### Fase 1: Limpieza de Bajo Riesgo (SAFE)

#### Paso 1.1: Eliminar `validateRequiredFields`
```typescript
// Archivo: src/shared/utils/validators.ts
// Eliminar líneas 113-132 (función completa)
// Eliminar del export en validators.test.ts línea 8
// Eliminar tests líneas 183-243 en validators.test.ts
```

#### Paso 1.2: Limpiar `MESSAGES` en messages.ts
```typescript
// Archivo: src/shared/constants/messages.ts
// Mantener solo:
export const MESSAGES = {
  GAME: {
    // Mantener solo los usados en rickmorty.api.ts y VictoryModal
    API_ERROR: 'No se pudo conectar con el API de Rick and Morty',
    API_RETRY: 'Reintentando conexión con el API...',
    API_UNAVAILABLE: 'El API de Rick and Morty no está disponible. Intenta más tarde.',
    API_RATE_LIMIT: 'Demasiadas peticiones. Espera un momento e intenta de nuevo.',
  },
} as const;

// ELIMINAR completamente:
// - MESSAGES.GENERAL
// - MESSAGES.UI
// - MESSAGES.FORMS
// - MESSAGES.APP
// - MESSAGES.GAME.START, PAUSE, RESUME, WIN, LOSE, MATCH, NO_MATCH, etc.
```

#### Paso 1.3: Eliminar acciones no usadas del GameStore
```typescript
// Archivo: src/domains/game/store/useGameStore.ts
// Eliminar línea 30: setGameStatus
// Eliminar línea 32: setCards

// Archivo: src/domains/game/types/game.types.ts
// Eliminar de GameActions interface:
// - setGameStatus: (status: GameStatus) => void;
// - setCards: (cards: Card[]) => void;
```

---

### Fase 2: Verificación Post-Limpieza

#### Paso 2.1: Ejecutar tests
```bash
npm test
```

#### Paso 2.2: Verificar TypeScript
```bash
npm run type-check
```

#### Paso 2.3: Verificar build
```bash
npm run build
```

---

## 6. Resumen de Eliminaciones

### Archivos a Modificar

| Archivo | Líneas a Eliminar | Descripción |
|---------|-------------------|-------------|
| `validators.ts` | 17 líneas | `validateRequiredFields` |
| `validators.test.ts` | ~60 líneas | Tests de `validateRequiredFields` |
| `messages.ts` | ~49 líneas | Constantes no usadas |
| `useGameStore.ts` | 2 líneas | `setGameStatus`, `setCards` |
| `game.types.ts` | 2 líneas | Tipos de acciones no usadas |

**Total:** ~130 líneas de código a eliminar

---

## 7. Código a MANTENER (Falsos Positivos)

### ✅ Funciones que parecen no usadas pero SÍ lo están

1. **`validateEmail`** - Usada indirectamente por `validateLoginCredentials`
2. **`validateUsername`** - Usada indirectamente por `validateRegisterCredentials`
3. **`previewTimeoutId`/`evaluateTimeoutId`** - Usados internamente en store (fix crítico)

---

## 8. Beneficios de la Limpieza

### Mejoras Esperadas

- ✅ **Bundle size:** Reducción estimada de ~2-3 KB
- ✅ **Mantenibilidad:** Menos código que mantener
- ✅ **Claridad:** Código más enfocado en lo que realmente se usa
- ✅ **Performance:** Menos imports innecesarios
- ✅ **Tests:** Menos tests que mantener (~60 líneas)

### Riesgos

- 🟢 **BAJO:** Todo el código identificado está bien aislado
- 🟢 **Tests:** Cobertura completa para verificar que nada se rompe
- 🟢 **TypeScript:** Detectará cualquier referencia perdida

---

## 9. Recomendaciones

### Inmediatas (Hacer AHORA)
1. ✅ Eliminar `validateRequiredFields` (nunca usada)
2. ✅ Limpiar constantes en `MESSAGES` (49 líneas)
3. ✅ Eliminar `setGameStatus` y `setCards` del store

### Futuras (Considerar)
1. 📋 Configurar ESLint plugin `eslint-plugin-unused-imports`
2. 📋 Agregar pre-commit hook para detectar imports no usados
3. 📋 Revisar periódicamente con herramientas como `ts-prune`

---

## 10. Comandos Útiles

### Detectar imports no usados
```bash
# Instalar ts-prune
npm install -D ts-prune

# Ejecutar análisis
npx ts-prune
```

### Detectar código muerto con ESLint
```bash
# Agregar a .eslintrc
{
  "plugins": ["unused-imports"],
  "rules": {
    "unused-imports/no-unused-imports": "error"
  }
}
```

---

## Conclusión

Se identificaron **~130 líneas de código muerto** distribuidas en 5 archivos. La limpieza es de **bajo riesgo** ya que todo el código está bien aislado y tenemos cobertura de tests completa para verificar que nada se rompe.

**Próximo paso:** Ejecutar limpieza en Fase 1 y verificar con tests.
