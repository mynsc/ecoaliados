# 🌱 EcoAliados

Aplicación de gamificación ecológica que permite a los usuarios (EcoAliados y EcoGuardianes) completar misiones, ganar puntos y contribuir al cuidado del medio ambiente.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Comandos Disponibles](#-comandos-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Flujo de Trabajo Git](#-flujo-de-trabajo-git)
- [Estándares de Código](#-estándares-de-código)
- [Contribuir](#-contribuir)

---

## ✨ Características

### 🏠 Inicio
- **Dashboard personalizado** con avatar y nombre del perfil
- **Estadísticas de reciclaje** y progreso diario sincronizado con Misiones
- **Racha de días consecutivos** con visualización de progreso
- **Sección de recompensas** desbloqueadas expandible/colapsable
- Acceso rápido a misiones con navegación integrada
- Saludo personalizado con nombre del usuario

### 🌳 Misiones
- **Sistema de misiones gamificadas** con seguimiento de progreso
- **Reportes de actividad** con notas y conteo de items reciclados
- **Misión principal destacada** con visualización especial
- **Recompensas automáticas** al completar objetivos
- **Historial de reportes** (últimos 100 eventos por misión)
- Tipos de misión: `count` (conteo) y `visit` (visitas)
- Validación de límites diarios y progreso

### 🏆 Ranking
- **Tabla de posiciones competitiva** con sistema de NPCs
- **Generación dinámica** de 7-10 competidores con stats realistas
- **Medallas y destacados**: trofeo oro, plata, bronce para top 3
- **Resaltado del usuario** con borde verde en su posición
- **Stats variadas**: ±50% de variación respecto al usuario para realismo
- Visualización de kg reciclados, misiones completadas y racha
- Motivación para mejorar posición en el ranking

### 👤 Perfil
- **Sistema de perfiles personalizables** con Context API y localStorage
- **Avatar temático** con 20 opciones eco-friendly (🌱, ♻️, 🌍, etc.)
- **Nombre personalizable** con validación (2-50 caracteres)
- **Estadísticas totales**: kg reciclados, misiones completadas, racha actual
- **Modal de edición** con validación en tiempo real y UX optimizada
- **Persistencia automática** en localStorage (key: `ecoaliados.profile.v1`)
- Sincronización global con Home, Misiones y Ranking

### 🎨 Interfaz
- **Diseño responsivo** optimizado para móviles
- **Navegación inferior** con 4 secciones principales
- **Animaciones** y transiciones suaves
- **Tema personalizado** con Tailwind CSS
- **Componentes accesibles** con shadcn/ui

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** o **pnpm** (gestor de paquetes)
- **Git** - [Descargar aquí](https://git-scm.com/)
- **Editor de código** (recomendamos [VS Code](https://code.visualstudio.com/))

### Extensiones recomendadas para VS Code:
- ESLint
- Tailwind CSS IntelliSense

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/mynsc/ecoaliados.git
cd ecoaliados
```

### 2. Instalar dependencias

Usando npm:
```bash
npm install
```

O usando pnpm (recomendado):
```bash
pnpm install
```

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 🛠️ Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` / `pnpm dev` | Inicia el servidor de desarrollo con hot-reload |
| `npm run build` / `pnpm build` | Compila TypeScript y crea la versión optimizada para producción |
| `npm run preview` / `pnpm preview` | Previsualiza el build de producción localmente |
| `npm run lint` / `pnpm lint` | Ejecuta ESLint para revisar el código |
| `npm run test` / `pnpm test` | Ejecuta las pruebas con Vitest |
| `npm run tailwind:init` | Inicializa la configuración de Tailwind CSS |

---

## 📁 Estructura del Proyecto

```
ecoaliados/
├── public/                      # Archivos estáticos (imágenes, iconos, etc.)
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── layout/             # Componentes de estructura
│   │   │   ├── MainLayout.tsx  # Layout principal con navegación por tabs
│   │   │   ├── BottomNavigation.tsx  # Barra de navegación inferior
│   │   │   └── index.ts
│   │   └── ui/                 # Componentes base de UI (shadcn/ui)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       ├── progress.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── index.ts
│   ├── features/               # Funcionalidades por módulos
│   │   ├── home/              # Módulo de Inicio
│   │   │   ├── components/
│   │   │   │   └── HomeView.tsx
│   │   │   └── index.ts
│   │   ├── missions/          # Módulo de Misiones
│   │   │   ├── components/
│   │   │   │   ├── MissionCard.tsx
│   │   │   │   └── MissionReportModal.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useMissions.ts
│   │   │   ├── Missions.tsx
│   │   │   ├── missions.types.ts    # Tipos e interfaces
│   │   │   ├── missions.utils.ts    # Utilidades
│   │   │   ├── missions.data.ts     # Datos iniciales
│   │   │   ├── missions.test.ts     # Tests con Vitest
│   │   │   └── index.ts
│   │   ├── leaderboard/       # Módulo de Ranking
│   │   │   ├── components/
│   │   │   │   └── LeaderboardView.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useLeaderboard.ts
│   │   │   ├── leaderboard.utils.ts    # Generación de NPCs y rankings
│   │   │   └── index.ts
│   │   └── profile/           # Módulo de Perfil
│   │       ├── components/
│   │       │   ├── ProfileView.tsx
│   │       │   └── ProfileEditModal.tsx
│   │       ├── hooks/
│   │       │   └── useProfileStats.ts
│   │       ├── profile.utils.ts    # Cálculos de estadísticas
│   │       └── index.ts
│   ├── contexts/              # Contextos globales (Context API)
│   │   ├── MissionsContext.ts
│   │   ├── MissionsProvider.tsx
│   │   ├── ProfileContext.ts
│   │   ├── ProfileProvider.tsx
│   │   └── index.ts          # Hooks personalizados (useMissionsContext, useProfileContext)
│   ├── lib/                   # Utilidades y helpers
│   │   └── utils.ts          # Función cn() para clases condicionales
│   ├── App.tsx               # Componente raíz
│   ├── main.tsx              # Punto de entrada de React
│   ├── index.css             # Estilos globales (Tailwind CSS)
│   └── vite-env.d.ts         # Tipos de Vite
├── components.json             # Configuración de shadcn/ui
├── eslint.config.js           # Configuración de ESLint
├── index.html                 # HTML base
├── package.json               # Dependencias y scripts
├── pnpm-lock.yaml            # Lock file de pnpm
├── pnpm-workspace.yaml       # Configuración de workspace
├── tsconfig.json             # Configuración de TypeScript
├── tsconfig.app.json         # Config TS para la app
├── tsconfig.node.json        # Config TS para Node
├── vite.config.ts            # Configuración de Vite
└── README.md                 # Este archivo
```

### Convenciones de carpetas:
- **`components/ui/`**: Componentes base reutilizables de shadcn/ui (button, card, badge, progress, dialog, input, label)
- **`components/layout/`**: Componentes de estructura (MainLayout, BottomNavigation)
- **`contexts/`**: Contextos globales con Context API (MissionsContext, ProfileContext) y sus Providers
  - Incluye hooks personalizados: `useMissionsContext()`, `useProfileContext()`
  - Persistencia automática en localStorage
- **`features/`**: Módulos de funcionalidades organizados por feature
  - Cada feature tiene su propia carpeta con `components/`, `hooks/`, tipos, utilidades y tests
  - Estructura modular: `home/`, `missions/`, `leaderboard/`, `profile/`
- **`lib/`**: Funciones utilitarias compartidas (ej. `cn()` para Tailwind)

### Arquitectura de Features:
Cada módulo en `features/` sigue una estructura consistente:
```
feature-name/
├── components/           # Componentes específicos del feature
├── hooks/               # Custom hooks del feature
├── FeatureName.tsx      # Componente principal exportado
├── feature-name.types.ts    # Tipos TypeScript
├── feature-name.utils.ts    # Funciones utilitarias
├── feature-name.data.ts     # Datos mock o iniciales
├── feature-name.test.ts     # Tests con Vitest
└── index.ts             # Exportaciones públicas
```

---

## 🔧 Tecnologías Utilizadas

### Core:
- **[React 19](https://react.dev/)** - Librería de UI
- **[TypeScript 5.8](https://www.typescriptlang.org/)** - Tipado estático
- **[Vite 7](https://vitejs.dev/)** - Build tool ultra rápido con HMR

### UI y Estilos:
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes accesibles y personalizables
- **[Radix UI](https://www.radix-ui.com/)** - Primitivos de UI sin estilos (Dialog, Label, Progress, Slot)
- **[Lucide React](https://lucide.dev/)** - Biblioteca de iconos moderna
- **[class-variance-authority](https://cva.style/)** - Variantes de componentes
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge inteligente de clases
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications elegantes

### Estado Global:
- **Context API** - Gestión de estado con MissionsContext y ProfileContext
- **localStorage** - Persistencia de datos del cliente
  - `ecoaliados.missions.v1` - Estado de misiones y progreso
  - `ecoaliados.profile.v1` - Perfil del usuario (nombre, avatar, fecha)

### Testing:
- **[Vitest 4](https://vitest.dev/)** - Framework de testing ultra rápido

### Herramientas de desarrollo:
- **ESLint 9** - Linter de código con plugins para React
- **@vitejs/plugin-react-swc** - Compilador ultra rápido con SWC
- **TypeScript ESLint** - Reglas de linting para TypeScript

---

## 🔀 Flujo de Trabajo Git

### 1. Antes de empezar a trabajar

Siempre actualiza tu rama local con los últimos cambios:

```bash
git checkout main
git pull origin main
```

### 2. Crear una nueva rama para tu feature

```bash
git checkout -b feature/nombre-descriptivo
```

Ejemplos de nombres de ramas:
- `feature/login-page`
- `feature/missions-list`
- `fix/bug-navigation`
- `refactor/dashboard-components`

### 3. Hacer commits frecuentes y descriptivos

```bash
git add .
git commit -m "Agrega componente de login con validación"
```

**Formato recomendado de commits:**
- `feat: agrega nueva funcionalidad`
- `fix: corrige bug en navegación`
- `refactor: reorganiza componentes del dashboard`
- `style: ajusta estilos del header`
- `docs: actualiza README con instrucciones`

### 4. Subir cambios a GitHub

```bash
git push origin feature/nombre-descriptivo
```

### 5. Crear Pull Request (PR)

1. Ve a GitHub y abre un **Pull Request**
2. Describe los cambios realizados
3. Asigna revisores del equipo
4. Espera aprobación antes de hacer merge

### 6. Mantener tu rama actualizada

Si `main` tiene cambios nuevos mientras trabajas:

```bash
git checkout feature/tu-rama
git pull origin main
# Resuelve conflictos si los hay
git push origin feature/tu-rama
```

---

## 📝 Estándares de Código

### TypeScript:
- Usa tipos explícitos siempre que sea posible
- Evita usar `any`, prefiere `unknown` si es necesario
- Define interfaces para props de componentes

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}
```

### React:
- Usa **functional components** con hooks
- Nombres de componentes en **PascalCase**
- Nombres de archivos coinciden con el componente: `Dashboard.tsx`

### Tailwind CSS:
- Usa clases de Tailwind en lugar de CSS custom
- Usa la función `cn()` de `lib/utils.ts` para clases condicionales

```typescript
import { cn } from "@/lib/utils";

<button className={cn("px-4 py-2", isActive && "bg-blue-500")}>
```

### ESLint:
El proyecto viene configurado con ESLint. Antes de hacer commit, ejecuta:

```bash
npm run lint
```

---

## 👥 Contribuir

### Proceso de contribución:

1. **Fork** el repositorio (si eres colaborador externo)
2. **Clona** tu fork o el repositorio principal
3. **Crea una rama** para tu feature
4. **Desarrolla** siguiendo los estándares de código
5. **Haz commit** de tus cambios con mensajes descriptivos
6. **Push** a tu rama
7. **Abre un Pull Request** con descripción detallada
8. **Espera revisión** del equipo
9. **Ajusta** según feedback si es necesario
10. **Merge** una vez aprobado

### Reportar bugs:

Si encuentras un bug, abre un **Issue** en GitHub con:
- Descripción del problema
- Pasos para reproducirlo
- Comportamiento esperado vs actual
- Screenshots si aplica

---

**¡Gracias por contribuir a EcoAliados! 🌍💚**
