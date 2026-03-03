# Contrato de Desarrollo - Memory Project

## Principios Fundamentales

### 1. Sistema de Tipos

- **Todo el código debe estar escrito en TypeScript**
- **Nunca usar `any`** en definiciones de tipos
- Todos los tipos deben ser explícitos y bien definidos
- Usar interfaces y tipos genéricos cuando sea apropiado
- Evitar `unknown` salvo que sea estrictamente necesario y esté justificado

### 2. Paradigma de Programación

- **Programación Funcional** como paradigma principal
- Priorizar **funciones puras** sobre funciones con efectos secundarios
- Cada función debe tener **responsabilidad única**
- Las funciones deben ser **independientes** y composables
- Evitar mutación de estado, usar inmutabilidad en todas las operaciones

### 3. Gestión de Estado

#### useState

- **Siempre usar el valor previo** para actualizaciones de estado
- ❌ Incorrecto: `setCount(count + 1)`
- ✅ Correcto: `setCount((prev) => prev + 1)`

```typescript
// Ejemplo correcto
const [count, setCount] = useState<number>(0)
const increment = () => setCount((prev) => prev + 1)
```

#### Zustand

- Usar **Zustand** para estado global de la aplicación
- Las stores deben ser modularizadas por dominio
- Evitar estado global innecesario


### 4. Persistencia de Datos

- **localStorage** para persistir el token de OAuth
- Nunca almacenar tokens en estado global sin persistencia
- Implementar mecanismos seguros de almacenamiento

```typescript
// Ejemplo de persistencia de token
const TOKEN_KEY = 'oauth_token'

const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}
```

### 5. Arquitectura por Dominios y Módulos

```
src/
├── domains/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── store/
│   ├── user/
│   └── dashboard/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── utils/
```

### 6. Estructura de Componentes

Cada componente debe tener:

1. **Template JSX** - Estructura visual del componente
2. **Lógica en TypeScript** - Funcionalidad separada en hooks/functions
3. **CSS con Tailwind** - Usando `@apply` para clases reutilizables
4. **Archivo de Testing** - Tests para cada funcionalidad

```
ComponentName/
├── ComponentName.tsx       # Componente principal
├── ComponentName.test.tsx  # Tests
├── ComponentName.css       # Estilos con @apply
└── useComponentName.ts     # Hook personalizado (si aplica)
```

### 7. Custom Hooks

- **Evaluar siempre** si la lógica puede ser un custom hook
- Los custom hooks deben ser **funciones puras** cuando sea posible
- Reutilizar código a través de custom hooks
- Mantener hooks pequeños y con responsabilidad única

```typescript
// Ejemplo de custom hook puro
const useCounter = (initialValue: number = 0) => {
  const [count, setCount] = useState<number>(initialValue)
  
  const increment = useCallback(() => {
    setCount((prev) => prev + 1)
  }, [])
  
  const decrement = useCallback(() => {
    setCount((prev) => prev - 1)
  }, [])
  
  const reset = useCallback(() => {
    setCount(initialValue)
  }, [initialValue])
  
  return { count, increment, decrement, reset }
}
```

### 8. Consumo de APIs

#### Archivo Específico para Servicios API

- Crear un archivo/módulo específico para consumo de APIs
- Las funciones de API deben tener **mínima exposición** como efecto secundario
- **Validar toda la data recibida** del API antes de usarla
- Manejar y evitar errores proactivamente

```typescript
// domains/auth/services/auth.api.ts
import { ApiResponse, User, AuthTokens } from '../types'

// Función pura de validación
const validateUserResponse = (data: unknown): User => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid user response')
  }
  
  const user = data as Record<string, unknown>
  
  if (typeof user.id !== 'string' || typeof user.name !== 'string') {
    throw new Error('Invalid user data structure')
  }
  
  return user as User
}

// Función con efecto secundario controlado (mínima exposición)
export const login = async (
  credentials: LoginCredentials
): Promise<ApiResponse<AuthTokens>> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }
    
    const data = await response.json()
    const validatedData = validateUserResponse(data)
    
    return { success: true, data: validatedData }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
```

### 9. Validaciones de Data del API

- **Nunca confiar** en la data recibida del API
- Crear funciones validadoras para cada tipo de respuesta
- Usar type guards para validar estructuras
- Retornar errores descriptivos cuando la validación falle

```typescript
// shared/utils/validators.ts
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export const hasRequiredKeys = <T extends string>(
  obj: Record<string, unknown>,
  keys: T[]
): obj is Record<T, unknown> => {
  return keys.every((key) => key in obj)
}
```

### 10. Funciones Puras vs Impuras

#### Funciones Puras (Priorizar)

- Mismo input → mismo output siempre
- Sin efectos secundarios
- Sin mutación de estado externo

```typescript
// ✅ Función pura
const calculateTotal = (prices: number[]): number => {
  return prices.reduce((sum, price) => sum + price, 0)
}
```

#### Funciones Impuras (Minimizar)

- Efectos secundarios controlados y aislados
- Documentar claramente cuando una función es impura
- Envolver efectos secundarios en funciones puras cuando sea posible

```typescript
// ✅ Función impura con efecto secundario controlado
const saveToStorage = (key: string, value: string): Result<void, Error> => {
  try {
    localStorage.setItem(key, value)
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Storage error')
    }
  }
}
```

## Checklist de Revisión de Código

Antes de hacer commit, verificar:

- [ ] ¿Todo el código está en TypeScript?
- [ ] ¿No hay ningún `any` en los tipos?
- [ ] ¿Las funciones son puras cuando es posible?
- [ ] ¿Cada función tiene responsabilidad única?
- [ ] ¿Los useState usan el valor previo para actualizaciones?
- [ ] ¿La lógica podría estar en un custom hook reutilizable?
- [ ] ¿La data del API está validada antes de usarse?
- [ ] ¿Los efectos secundarios están minimizados y controlados?
- [ ] ¿El componente tiene su archivo de testing?
- [ ] ¿Los estilos usan `@apply` de Tailwind cuando corresponde?
- [ ] ¿Se usan las herramientas y librerías correctas?
- [ ] ¿Se debe verificar el responsive de la aplicación?

## Herramientas y Librerías

| Propósito | Librería |
|-----------|----------|
| Lenguaje | TypeScript |
| Framework | React 19+ |
| Estado Global | Zustand |
| Estilos | Tailwind CSS 4+ |
| Testing | Vitest + React Testing Library |
| Build | Vite |

## Referencias

- [Functional Programming en TypeScript](https://www.typescriptlang.org/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Tailwind CSS v4](https://tailwindcss.com/)
