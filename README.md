# Memory Game - Rick & Morty Edition 🧪🚀

Un juego de memoria interactivo construido con React y TypeScript, donde los jugadores deben encontrar pares de personajes de Rick y Morty. Incluye animaciones épicas, autenticación OAuth con Supabase y una arquitectura de código de alta calidad.

## 🎮 Características

- **Juego de Memoria Clásico** - Encuentra pares de personajes de Rick & Morty
- **Animaciones Épicas** - Portal interdimensional al iniciar cada partida
- **Autenticación Segura** - Login/registro con OAuth usando Supabase
- **Interfaz Moderna** - Diseño responsive con Tailwind CSS
- **Código de Calidad** - TypeScript estricto, programación funcional pura
- **Testing Completo** - Cobertura 100% de funcionalidades críticas

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19+, TypeScript, Tailwind CSS 4+
- **Backend as a Service**: Supabase (OAuth, Auth, Database)
- **Estado**: Zustand (state management)
- **API**: Rick and Morty REST API
- **Testing**: Vitest + React Testing Library
- **Build**: Vite
- **Linter**: ESLint
- **Autenticación**: OAuth con Supabase (tokens en localStorage)

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** versión 18 o superior
- **npm** o **pnpm** (recomendado pnpm)
- **Git** para clonar el repositorio
- **Cuenta de Supabase** (gratuita)

### Verificar instalación

```bash
# Verificar Node.js
node --version
# Debe mostrar: v18.x.x o superior

# Verificar npm
npm --version
# Debe mostrar: 9.x.x o superior

# Verificar Git
git --version
# Debe mostrar: git version 2.x.x
```

## 🚀 Instalación y Configuración

### Paso 1: Clonar el repositorio

```bash
# Clonar desde GitHub
git clone https://github.com/leuzga/RickMortyMem.git

# Entrar al directorio del proyecto
cd RickMortyMem
```

### Paso 2: Instalar dependencias

```bash
# Con npm
npm install

# O con pnpm (recomendado)
pnpm install
```

### Paso 3: Configurar Supabase

#### 3.1 Crear cuenta en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto

#### 3.2 Obtener credenciales

Después de crear el proyecto:

1. Ve a **Settings > API**
2. Copia tu **Project URL** y **anon public key**

#### 3.3 Configurar autenticación

En Supabase Dashboard:

1. Ve a **Authentication > Providers**
2. Habilita los providers que quieras usar (Google, GitHub, etc.)
3. Configura cada provider con sus credenciales respectivas

### Paso 4: Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Copiar el archivo de ejemplo
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
# Supabase Configuration (OBLIGATORIO)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui

# API de Rick and Morty (ya configurada)
VITE_RICK_MORTY_API=https://rickandmortyapi.com/api

# Configuración de desarrollo
VITE_APP_ENV=development
```

**⚠️ Importante:** Nunca subas `.env.local` a Git. Ya está en `.gitignore`.

### Paso 5: Ejecutar la aplicación

```bash
# Modo desarrollo
npm run dev

# O con pnpm
pnpm dev
```

La aplicación estará disponible en: **`http://localhost:5173`**

## 🎯 Cómo Jugar

1. **Inicia sesión** - Crea una cuenta o inicia sesión con OAuth (Google, GitHub, etc.)
2. **Comienza el juego** - Haz click en "Jugar de nuevo"
3. **Observa la animación** - Verás un portal interdimensional barajando las cartas
4. **Encuentra los pares** - Haz click en dos cartas para voltearlas
5. **Gana el juego** - Encuentra todos los 9 pares para completar el juego

## 🔐 Configuración de OAuth con Supabase

### Providers Soportados

La aplicación soporta múltiples proveedores OAuth a través de Supabase:

- **Google OAuth**
- **GitHub OAuth**
- **Email/Password** (registro tradicional)

### Configuración por Provider

#### Google OAuth
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Habilita Google+ API
4. Crea credenciales OAuth 2.0
5. Configura authorized redirect URIs:
   - Desarrollo: `http://localhost:5173`
   - Producción: `https://tu-dominio.com`
6. Copia Client ID y Client Secret a Supabase

#### GitHub OAuth
1. Ve a GitHub Settings > Developer settings > OAuth Apps
2. Crea una nueva OAuth App
3. Configura:
   - Homepage URL: `http://localhost:5173` (desarrollo)
   - Authorization callback URL: `https://tu-proyecto.supabase.co/auth/v1/callback`
4. Copia Client ID y Client Secret a Supabase

### Base de Datos Supabase

La aplicación crea automáticamente las siguientes tablas:

- **profiles** - Perfiles de usuario
- **games** - Historial de juegos
- **game_stats** - Estadísticas por usuario

## 📁 Estructura del Proyecto

```bash
RickMortyMem/
├── public/                 # Archivos estáticos
├── src/
│   ├── domains/           # Arquitectura por dominios
│   │   ├── auth/         # Autenticación y OAuth
│   │   │   ├── components/  # Componentes de login/registro
│   │   │   ├── services/    # APIs de Supabase
│   │   │   ├── store/       # Estado de autenticación
│   │   │   └── types/       # Tipos de TypeScript
│   │   └── game/         # Lógica del juego
│   │       ├── components/  # Componentes del juego
│   │       ├── constants/   # Configuración del juego
│   │       ├── hooks/       # Hooks personalizados
│   │       ├── services/    # API de Rick & Morty
│   │       ├── store/       # Estado del juego
│   │       ├── types/       # Tipos del juego
│   │       └── utils/       # Funciones puras
│   ├── shared/            # Componentes compartidos
│   │   ├── components/    # Toast, Header, etc.
│   │   └── utils/         # Utilidades generales
│   ├── App.tsx            # Componente principal
│   ├── main.tsx           # Punto de entrada
│   └── index.css          # Estilos globales
├── supabase/              # Configuración de Supabase
│   ├── migrations/        # Migraciones de BD
│   └── config.toml        # Configuración local
├── .env.local             # Variables de entorno (local)
├── .env.test              # Variables de entorno (testing)
├── package.json           # Dependencias y scripts
├── tailwind.config.js     # Configuración de Tailwind
├── vite.config.js         # Configuración de Vite
└── README.md              # Este archivo
```

## � Componentes Totales en el Proyecto Memory

**Total: 26 componentes** organizados por arquitectura por dominios:

### 🎮 Game Domain (5 componentes)
```
src/domains/game/components/
├── Card/           # Carta individual con animaciones 3D
├── CardsGrid/      # Grid de cartas con portal interdimensional
├── GameBoard/      # Tablero principal del juego
├── GameStats/      # Estadísticas (turnos, pares encontrados)
└── VictoryModal/   # Modal de victoria con confeti
```

### 🔐 Auth Domain (5 componentes)
```
src/domains/auth/components/
├── AuthLayout/     # Layout común para páginas de auth
├── ForgotPasswordForm/ # Formulario de recuperación de contraseña
├── LoginForm/      # Formulario de login con OAuth
├── OAuthButtons/   # Botones de autenticación social
└── RegisterForm/   # Formulario de registro
```

### 🎨 Shared Domain (3 componentes)
```
src/shared/components/
├── Header/         # Header con avatar y menú dropdown
├── Toast/          # Notificaciones tipo toast
└── ToastContainer/ # Contenedor de toasts
```

### 🏠 Raíz del proyecto (13 componentes)
```
src/
├── App.tsx                    # Componente principal
├── App.test.tsx              # Tests del App
├── ErrorBoundary.tsx         # Manejo de errores
├── Router.tsx                # Configuración de rutas
├── Router.test.tsx           # Tests del router
├── pages/
│   ├── GamePage.tsx         # Página del juego
│   ├── HomePage.tsx         # Página de inicio
│   ├── LoginPage.tsx        # Página de login
│   ├── NotFoundPage.tsx     # Página 404
│   ├── RegisterPage.tsx     # Página de registro
│   └── ResetPasswordPage.tsx # Página de reset password
└── 7 archivos de test adicionales
```

### 📈 Resumen por Categoría

| Categoría | Cantidad | Descripción |
|-----------|----------|-------------|
| **Game** | 5 | Lógica del juego de memoria |
| **Auth** | 5 | Sistema de autenticación |
| **Shared** | 3 | Componentes reutilizables |
| **Pages** | 6 | Páginas de la aplicación |
| **Raíz** | 7 | Componentes principales y tests |
| **TOTAL** | **26** | Componentes activos |

### 🎯 Arquitectura DDD (Domain-Driven Design)

✅ **Separación clara por dominios:**
- `game/` - Lógica del juego de memoria
- `auth/` - Autenticación y registro
- `shared/` - Componentes transversales

✅ **Cada componente tiene:**
- `ComponentName.tsx` - Implementación
- `ComponentName.module.css` - Estilos con scoping automático
- `ComponentName.test.tsx` - Tests unitarios

## ⚡ Performance & Optimizaciones

### Lazy Loading

El dominio `game` se carga de forma diferida usando `React.lazy` + `Suspense`. Esto reduce el bundle inicial de la pantalla de login, cargando el código del juego **solo cuando el usuario se autentica**.

```
App.tsx
└── <Suspense fallback={<LoadingFallback />}>
      <GameBoard />   ← cargado on-demand
    </Suspense>
```

### Memoización de Componentes

Para evitar re-renderizaciones en cadena al voltear cartas, todos los componentes del juego están memoizados:

| Componente | Técnica | Detalle |
|---|---|---|
| `Card` | `React.memo` + comparador | Re-renderiza solo si cambia `isFlipped`, `isMatched` o `isShuffling` |
| `Card` | `useCallback` | `handleClick` no se recrea en cada render |
| `CardsGrid` | `React.memo` | Shallow comparison (suficiente para sus props) |
| `GameStats` | `React.memo` | Props primitivos — muy eficiente |
| `VictoryModal` | `React.memo` + `useCallback` | No re-renderiza hasta que `gameStatus === 'finished'` |

> **Resultado**: Al voltear una carta, solo se re-renderizan los componentes cuyas props realmente cambiaron, en lugar de todo el tablero.



```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm run preview      # Vista previa de producción

# Testing
npm run test         # Ejecuta todos los tests
npm run test:watch   # Tests en modo watch
npm run test:ui      # Interfaz gráfica de tests

# Calidad de código
npm run lint         # Ejecuta ESLint
npm run lint:fix     # Corrige errores de ESLint automáticamente
npm run type-check   # Verifica tipos de TypeScript

# Supabase
npm run supabase:start   # Inicia Supabase local
npm run supabase:stop    # Detiene Supabase local
npm run supabase:reset   # Resetea base de datos local

# Git
npm run pre-commit   # Ejecuta linting y tests antes de commit
```

## 🔧 Desarrollo

### Configuración del Entorno de Desarrollo

1. **Editor recomendado**: Visual Studio Code
2. **Extensiones necesarias**:
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense
   - ESLint
   - Prettier
   - Supabase (opcional)

### Supabase Local Development

Para desarrollo local con Supabase:

```bash
# Instalar Supabase CLI
npm install -g supabase

# Iniciar Supabase local
npm run supabase:start

# Esto crea:
# - PostgreSQL database
# - Supabase services
# - Dashboard local en http://localhost:54323
```

### Convenciones de Código

Esta aplicación sigue estándares estrictos de desarrollo:

- **TypeScript estricto** - Sin tipos `any`, tipos explícitos en todo
- **Programación funcional** - Funciones puras, inmutabilidad, composición
- **Arquitectura por dominios** - Separación clara de responsabilidades
- **Testing obligatorio** - Tests para todas las funcionalidades
- **Commits convencionales** - Mensajes descriptivos y bien formateados

### Flujo de Trabajo

```bash
# 1. Crear rama para nueva funcionalidad
git checkout -b feature/nueva-funcionalidad

# 2. Desarrollar siguiendo el contrato
# - Usar TypeScript estricto
# - Crear tests para nueva funcionalidad
# - Seguir principios funcionales

# 3. Verificar calidad antes de commit
npm run lint
npm run type-check
npm run test

# 4. Commit con mensaje descriptivo
git commit -m "feat: descripción de la nueva funcionalidad"

# 5. Push y crear Pull Request
git push origin feature/nueva-funcionalidad
```

## 🧪 Testing

La aplicación incluye testing completo:

```bash
# Ejecutar todos los tests
npm run test

# Tests con interfaz gráfica
npm run test:ui

# Cobertura de tests
npm run test:coverage
```

### Tipos de Tests Incluidos

- **Unit Tests**: Funciones puras, utilidades, validadores
- **Component Tests**: Componentes React con Testing Library
- **Integration Tests**: Flujos completos de autenticación y juego
- **API Tests**: Mocks de llamadas a Rick & Morty API
- **E2E Tests**: Tests end-to-end con Playwright (futuro)

## 🚀 Despliegue

### Build de Producción

```bash
# Construir para producción
npm run build

# Vista previa local del build
npm run preview
```

### Variables de Producción

Para producción, configura estas variables de entorno:

```env
# Supabase Production
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_produccion

# API de Rick and Morty
VITE_RICK_MORTY_API=https://rickandmortyapi.com/api

# Entorno de producción
VITE_APP_ENV=production
```

### Plataformas Recomendadas

- **Vercel** - Despliegue automático desde GitHub
- **Netlify** - Excelente para SPAs con formularios
- **Railway** - Para aplicaciones full-stack
- **Supabase Hosting** - Integración nativa con Supabase

### Configuración de Producción en Supabase

1. Ve a tu proyecto en Supabase Dashboard
2. Configura los OAuth providers con URLs de producción
3. Actualiza las environment variables en tu plataforma de hosting
4. Configura las políticas RLS (Row Level Security) para producción

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Para contribuir:

1. **Fork** el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Sigue el **contrato de desarrollo** (ver CONTRACT.md)
4. Agrega tests para nueva funcionalidad
5. Asegura que todos los tests pasen
6. Crea un Pull Request

### Requisitos para Contribución

- ✅ Código en TypeScript (obligatorio)
- ✅ Funciones puras cuando sea posible
- ✅ Tests incluidos
- ✅ Linting pasa sin errores
- ✅ Tipos de TypeScript estrictos
- ✅ Commit messages descriptivos

## 📄 Licencia

Este proyecto es de código abierto y está bajo la **MIT License**.

## 🙏 Agradecimientos

- **Supabase** - Por la excelente plataforma BaaS
- **Rick and Morty API** - Por proporcionar los datos de personajes
- **React Team** - Por el excelente framework
- **Tailwind CSS** - Por el sistema de diseño utilitario
- **Vitest** - Por el testing moderno y rápido

## 📞 Soporte

Si encuentras problemas:

1. Revisa la sección de **Troubleshooting** abajo
2. Abre un **Issue** en GitHub
3. Incluye detalles: versión de Node.js, configuración de Supabase, errores en consola

## 🔧 Troubleshooting

### Problema: "Cannot resolve dependency"
```bash
# Limpiar cache de npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Problema: "Supabase connection failed"
```bash
# Verificar variables de entorno
cat .env.local

# Verificar que Supabase esté corriendo
npm run supabase:start

# Verificar credenciales en Supabase Dashboard
```

### Problema: "OAuth login not working"
```bash
# Verificar configuración de OAuth providers en Supabase
# Asegurarse que las redirect URLs estén configuradas correctamente
# Verificar que el anon key sea correcto
```

### Problema: "TypeScript errors"
```bash
# Verificar tipos
npm run type-check

# Si hay errores, revisa:
# 1. Variables de entorno (.env.local)
# 2. Tipos de TypeScript en archivos .ts/.tsx
# 3. Configuración de Supabase
```

### Problema: "Tests fallan"
```bash
# Ejecutar tests individualmente
npm run test -- src/domains/game/utils/game.utils.test.ts

# Verificar mocks y configuración
```

### Problema: "Build falla"
```bash
# Limpiar build anterior
rm -rf dist/
npm run build
```

---

**¡Disfruta jugando y aprendiendo con Rick y Morty! 🧪🚀**

---

**Desarrollado con ❤️ usando React, TypeScript y Supabase**
