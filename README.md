# 🌱 EcoAliados

Aplicación de gamificación ecológica que permite a los usuarios (EcoAliados y EcoGuardianes) completar misiones, ganar puntos y contribuir al cuidado del medio ambiente.

---

## 📋 Tabla de Contenidos

- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Comandos Disponibles](#-comandos-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Flujo de Trabajo Git](#-flujo-de-trabajo-git)
- [Estándares de Código](#-estándares-de-código)
- [Contribuir](#-contribuir)

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** (incluido con Node.js) o **yarn**
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

```bash
npm install
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
| `npm run dev` | Inicia el servidor de desarrollo con hot-reload |
| `npm run build` | Crea la versión optimizada para producción |
| `npm run preview` | Previsualiza el build de producción localmente |
| `npm run lint` | Ejecuta ESLint para revisar el código |

---

## 📁 Estructura del Proyecto

```
ecoaliados/
├── public/              # Archivos estáticos (imágenes, iconos, etc.)
├── src/
│   ├── components/      # Componentes reutilizables
│   │   └── ui/         # Componentes base de UI (buttons, cards, etc.)
│   ├── lib/            # Utilidades y helpers
│   ├── assets/         # Recursos de la aplicación
│   ├── App.tsx         # Componente raíz con lógica de autenticación
│   ├── Dashboard.tsx   # Componente principal de la aplicación
│   ├── main.tsx        # Punto de entrada de React
│   └── index.css       # Estilos globales (Tailwind CSS)
├── index.html          # HTML base
├── package.json        # Dependencias y scripts
├── vite.config.ts      # Configuración de Vite
├── tsconfig.json       # Configuración de TypeScript
└── README.md           # Este archivo
```

### Convenciones de carpetas:
- **`components/ui/`**: Componentes base reutilizables (botones, tarjetas, badges)
- **`components/layout/`**: Componentes de estructura (header, footer, navigation)
- **`components/features/`**: Componentes específicos de funcionalidades (login, missions, profile)
- **`lib/`**: Funciones utilitarias y helpers
- **`hooks/`**: Custom React hooks (cuando se agreguen)
- **`types/`**: Tipos e interfaces de TypeScript compartidos (cuando se agreguen)

---

## 🔧 Tecnologías Utilizadas

### Core:
- **[React 18](https://react.dev/)** - Librería de UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Vite](https://vitejs.dev/)** - Build tool y dev server

### Estilos:
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes de UI accesibles y personalizables

### Herramientas de desarrollo:
- **ESLint** - Linter de código
- **SWC** - Compilador rápido de JavaScript/TypeScript

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
