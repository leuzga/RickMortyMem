# Project Architecture Contract

## Overview

This document defines the architectural contract and coding standards for the **Memory** project. All development must adhere to these principles without exception.

---

## 1. Language & Type System

### 1.1 TypeScript Mandatory

- **All code must be written in TypeScript**
- No JavaScript files (`.js`, `.jsx`) allowed in source code
- Strict mode enabled (`"strict": true` in `tsconfig.json`)
- No `any` type unless absolutely unavoidable (use `unknown` instead)
- Explicit return types for all functions
- Proper interface/type definitions for all data structures

```typescript
// ✅ Correct
interface User {
  id: string
  name: string
  email: string
}

const getUserById = (id: string): User | null => {
  // implementation
}

// ❌ Incorrect
const getUserById = (id) => {
  // no types
}
```

---

## 2. Functional Programming Paradigm

### 2.1 Core Principles

All code must follow functional programming principles:

1. **Pure Functions First**
   - Functions must return the same output for the same input
   - No side effects (mutations, I/O, DOM manipulation)
   - No dependency on external mutable state

2. **Single Responsibility**
   - Each function does ONE thing and does it well
   - Small, composable functions over large monolithic ones

3. **Immutability**
   - No direct mutations of objects or arrays
   - Use spread operators, `map`, `filter`, `reduce`
   - Libraries: Immer (if needed for complex state)

4. **Function Composition**
   - Build complex logic by composing small functions
   - Use pipe/pattern for data transformations

```typescript
// ✅ Pure function
const calculateTotal = (items: Item[]): number =>
  items.reduce((sum, item) => sum + item.price, 0)

// ✅ Single responsibility
const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// ❌ Impure - has side effect
let counter = 0
const increment = () => {
  counter++ // mutation!
}
```

### 2.2 Function Categories

| Category | Description | Rules |
|----------|-------------|-------|
| **Pure** | No side effects, deterministic | Preferred for all business logic |
| **Impure** | I/O, API calls, DOM, state | Minimize, isolate, wrap in boundaries |
| **Custom Hooks** | React integration | Must be pure wrappers or state managers |

---

## 3. React State Management

### 3.1 useState with Previous Value

All state updates must use the previous value:

```typescript
// ✅ Correct - uses previous state
const [count, setCount] = useState<number>(0)
setCount(prev => prev + 1)

// ✅ Correct - object update
const [user, setUser] = useState<User | null>(null)
setUser(prev => prev ? { ...prev, name: 'New Name' } : null)

// ❌ Incorrect - direct reference
setCount(count + 1) // May use stale state
```

### 3.2 Zustand for Global State

- Use **Zustand** for global application state
- Stores must be pure functions with isolated side effects
- No direct state mutations outside store actions

```typescript
// stores/authStore.ts
import { create } from 'zustand'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(set => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set(() => ({ user, isAuthenticated: true })),
  logout: () => set(() => ({ user: null, isAuthenticated: false })),
}))
```

### 3.3 React Tank (TanStack Query) for API

- Use **TanStack Query** (`@tanstack/react-query`) for server state
- Separate server state from UI state
- Leverage caching, refetching, and optimistic updates

```typescript
// hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '@/services/api/users'

export const useUsers = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
```

---

## 4. OAuth Token Persistence

### 4.1 localStorage for Token Storage

- OAuth tokens MUST be stored in `localStorage`
- Token access must be encapsulated in dedicated functions
- Implement token refresh logic before expiration

```typescript
// services/auth/token.ts
const TOKEN_KEY = 'oauth_token'

export const getToken = (): string | null =>
  localStorage.getItem(TOKEN_KEY)

export const setToken = (token: string): void =>
  localStorage.setItem(TOKEN_KEY, token)

export const removeToken = (): void =>
  localStorage.removeItem(TOKEN_KEY)

export const isTokenExpired = (token: string): boolean => {
  // validation logic
}
```

---

## 5. Architecture by Domains & Modules

### 5.1 Domain-Driven Structure

```
src/
├── domains/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── types/
│   │   └── utils/
│   ├── users/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── types/
│   │   └── utils/
│   └── [domain]/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── utils/
├── App.tsx
└── main.tsx
```

### 5.2 Module Separation

Each domain is self-contained:
- Own components
- Own hooks
- Own services (API calls)
- Own state (Zustand stores)
- Own types
- Own utilities

**No cross-domain imports** except through shared module or explicit domain exports.

---

## 6. Component Structure

### 6.1 File Separation

Each component must have:

```
ComponentName/
├── ComponentName.tsx      # JSX template + TypeScript logic
├── ComponentName.css      # Styles with @apply
├── ComponentName.test.tsx # Tests
└── index.ts               # Exports
```

### 6.2 Component Template

```typescript
// ComponentName.tsx
import { useState, useCallback } from 'react'
import './ComponentName.css'

interface ComponentNameProps {
  /* props definition */
}

export const ComponentName = ({ prop }: ComponentNameProps) => {
  // State with previous value pattern
  const [state, setState] = useState<Type>(initialValue)
  
  // Handlers using previous state
  const handleClick = useCallback(() => {
    setState(prev => /* transformation */)
  }, [])

  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  )
}
```

### 6.3 CSS with @apply

```css
/* ComponentName.css */
.component-name {
  @apply flex items-center justify-center p-4 bg-brand text-white rounded-lg;
}

.component-name__button {
  @apply px-6 py-2 hover:opacity-90 transition-opacity;
}
```

---

## 7. Custom Hooks

### 7.1 Evaluation Criteria

Before writing logic inside a component, evaluate:

1. **Can this be a custom hook?**
   - Stateful logic
   - Side effects
   - Complex computations
   - API interactions

2. **Is it reusable?**
   - Could other components need this?
   - Does it encapsulate domain logic?

### 7.2 Custom Hooks Must Be Pure

```typescript
// ✅ Pure custom hook
export const useCounter = (initialValue: number = 0) => {
  const [count, setCount] = useState(initialValue)
  
  const increment = useCallback(() => {
    setCount(prev => prev + 1)
  }, [])
  
  const decrement = useCallback(() => {
    setCount(prev => prev - 1)
  }, [])
  
  const reset = useCallback(() => {
    setCount(initialValue)
  }, [initialValue])

  return { count, increment, decrement, reset }
}

// ❌ Impure - external dependency
let externalCounter = 0
export const useCounter = () => {
  const [count, setCount] = useState(externalCounter) // external state!
}
```

---

## 8. API Services Layer

### 8.1 Dedicated API Module

All API consumption must go through the services layer:

```
src/
└── services/
    ├── api/
    │   ├── client.ts       # Axios/fetch configuration
    │   ├── auth.ts         # Auth endpoints
    │   ├── users.ts        # Users endpoints
    │   └── [resource].ts
    └── interceptors/
        └── auth.interceptor.ts
```

### 8.2 Minimal Side Effect Exposure

API functions are inherently impure (I/O). Minimize exposure:

```typescript
// services/api/users.ts
import { apiClient } from './client'
import type { User } from '@/domains/users/types'

// Pure transformation functions
const parseUser = (data: unknown): User => {
  // validation and transformation
}

const parseUsers = (data: unknown): User[] => {
  // validation and transformation
}

// Impure - but isolated
export const fetchUsers = async (): Promise<User[]> => {
  const response = await apiClient.get('/users')
  return parseUsers(response.data)
}

export const fetchUserById = async (id: string): Promise<User> => {
  const response = await apiClient.get(`/users/${id}`)
  return parseUser(response.data)
}
```

### 8.3 Error Handling & Validation

```typescript
// services/api/client.ts
import axios, { AxiosError } from 'axios'
import { getToken, removeToken } from '@/services/auth/token'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - attach token
apiClient.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### 8.4 Service Function Contract

```typescript
// Template for all service functions
/**
 * Fetches [resource] from API
 * @param param - Description
 * @returns Promise<ReturnType>
 * @throws AxiosError on network/API errors
 */
export const [action][Resource] = async (param: Type): Promise<ReturnType> => {
  try {
    const response = await apiClient.get('/endpoint')
    return parse[Resource](response.data)
  } catch (error) {
    // Log and rethrow - let React Query handle UI errors
    console.error('[Service] Error fetching resource:', error)
    throw error
  }
}
```

---

## 9. Testing Requirements

### 9.1 Test File for Every Component

```typescript
// ComponentName.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName prop="value" />)
    expect(screen.getByText(/expected/i)).toBeInTheDocument()
  })
})
```

### 9.2 Test Pure Functions Separately

```typescript
// utils.test.ts
import { describe, it, expect } from 'vitest'
import { calculateTotal, validateEmail } from './utils'

describe('Pure Functions', () => {
  describe('calculateTotal', () => {
    it('calculates sum correctly', () => {
      const items = [{ price: 10 }, { price: 20 }]
      expect(calculateTotal(items)).toBe(30)
    })
  })
})
```

---

## 10. Best Practices Summary

| Principle | Implementation |
|-----------|----------------|
| **Type Safety** | TypeScript strict mode, no `any` |
| **Purity** | Pure functions for business logic |
| **Immutability** | No mutations, use spread/immer |
| **Single Responsibility** | One function = one job |
| **Composition** | Build complex from simple |
| **State Updates** | Always use previous value |
| **API Isolation** | Services layer with error handling |
| **Testing** | Test file for every component/hook |
| **Domain Separation** | No cross-domain coupling |

---

## 11. Quick Reference Checklist

Before committing code, verify:

- [ ] TypeScript types defined (no `any`)
- [ ] Functions are pure (or impure isolated)
- [ ] Single responsibility per function
- [ ] useState uses previous value (`prev => ...`)
- [ ] Custom hook extracted if reusable
- [ ] API calls through services layer
- [ ] Error handling in place
- [ ] Test file created/updated
- [ ] CSS uses `@apply`
- [ ] Domain boundaries respected

---

## Version

- **Contract Version:** 1.0.0
- **Last Updated:** 2026-03-02
- **Project:** Memory
