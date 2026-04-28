# v0-Inventory-Dashboard - Documentación para Desarrolladores

Bienvenido al proyecto **v0-Inventory-Dashboard**. Esta es una aplicación web moderna para gestionar inventario con un dashboard intuitivo. Esta guía te ayudará a entender la estructura del proyecto y cómo trabajar con él.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Archivos Importantes](#archivos-importantes)
6. [Flujo Básico de la Aplicación](#flujo-básico-de-la-aplicación)
7. [Stack Tecnológico](#stack-tecnológico)
8. [Cómo Modificar la UI](#cómo-modificar-la-ui)
9. [Componentes Principales](#componentes-principales)
10. [Guía de Estilo](#guía-de-estilo)
11. [Comandos Útiles](#comandos-útiles)

---

## 🎯 Descripción General

**v0-Inventory-Dashboard** es una aplicación de gestión de inventario construida con **Next.js 16** y diseñada con un sistema de diseño moderno usando **Tailwind CSS** y **Radix UI**.

**Características principales:**
- 🔐 Sistema de autenticación con sesiones
- 📊 Dashboard con gráficos y métricas en tiempo real
- 📦 Gestión de inventario e inventarios
- 🛍️ Gestión de productos
- 📈 Reportes y análisis
- 👥 Gestión de proveedores
- ⚙️ Configuración y ayuda
- 🌙 Soporte para tema claro/oscuro

---

## 📦 Requisitos Previos

Antes de empezar, asegúrate de tener instalados:

- **Node.js** (versión 18+)
- **npm** o **pnpm**
- **Git**

```bash
node --version  # Verifica la versión de Node.js
npm --version   # Verifica la versión de npm
```

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/TJhonatan999/v0-inventory-dashboard.git
cd v0-inventory-dashboard
```

### 2. Instalar dependencias

```bash
npm install
# O si usas pnpm:
pnpm install
```

### 3. Ejecutar el servidor de desarrollo

```bash
npm run dev
# O si usas pnpm:
pnpm dev
```

El servidor estará disponible en `http://localhost:3000`

### 4. Acceder a la aplicación

- URL: http://localhost:3000
- Email demo: `admin@inventory.com`
- Contraseña demo: `password123`

---

## 📁 Estructura del Proyecto

```
v0-inventory-dashboard/
├── app/                          # Directorio principal de Next.js
│   ├── page.tsx                  # Página raíz (redirecciona a login/dashboard)
│   ├── layout.tsx                # Layout raíz con AuthProvider
│   ├── globals.css               # Estilos globales y variables CSS
│   ├── login/
│   │   └── page.tsx              # Página de login
│   └── dashboard/                # Rutas protegidas del dashboard
│       ├── page.tsx              # Dashboard principal
│       ├── layout.tsx            # Layout del dashboard con sidebar
│       ├── inventory/
│       │   └── page.tsx          # Página de inventario
│       └── products/
│           └── page.tsx          # Página de productos
├── components/                   # Componentes reutilizables
│   ├── ui/                       # Componentes primitivos de UI (Radix UI)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ... (más componentes)
│   ├── header.tsx                # Encabezado de la aplicación
│   ├── sidebar.tsx               # Barra lateral de navegación
│   ├── metric-card.tsx           # Tarjeta de métrica
│   ├── chart-card.tsx            # Tarjeta con gráfico
│   ├── product-table.tsx         # Tabla de productos
│   ├── stock-alerts.tsx          # Alertas de stock
│   └── theme-provider.tsx        # Proveedor de tema
├── lib/                          # Utilidades y contextos
│   ├── auth-context.tsx          # Contexto de autenticación
│   └── utils.ts                  # Funciones utilitarias
├── hooks/                        # Custom hooks (si existen)
├── styles/                       # Estilos adicionales (si existen)
├── public/                       # Archivos estáticos (imágenes, iconos)
├── package.json                  # Dependencias y scripts
├── tsconfig.json                 # Configuración de TypeScript
├── next.config.mjs               # Configuración de Next.js
├── tailwind.config.ts            # Configuración de Tailwind CSS
├── postcss.config.mjs            # Configuración de PostCSS
└── components.json               # Configuración de componentes de Shadcn/ui
```

---

## 📄 Archivos Importantes

### 1. **app/layout.tsx** (Raíz de la aplicación)
- Define el layout raíz
- Envuelve la app con `AuthProvider`
- Importa estilos globales
- Configura metadatos

### 2. **lib/auth-context.tsx** (Contexto de autenticación)
- Gestiona el estado de autenticación
- Proporciona hooks `useAuth()`
- Maneja redirecciones basadas en autenticación
- Almacena datos en `sessionStorage`

### 3. **app/page.tsx** (Página de entrada)
- Redirecciona automáticamente según el estado de autenticación
- Muestra spinner de carga mientras verifica el estado

### 4. **app/login/page.tsx** (Página de login)
- Formulario de autenticación
- Validación de email y contraseña
- Almacena credenciales en `sessionStorage`

### 5. **app/dashboard/layout.tsx** (Layout del dashboard)
- Estructura con sidebar y contenido principal
- Implementa protección de rutas

### 6. **app/dashboard/page.tsx** (Dashboard principal)
- Métricas principales
- Gráficos de inventario (Line, Pie, Bar)
- Tabla de productos
- Alertas de stock

### 7. **app/globals.css** (Estilos globales)
- Variables CSS en formato OKLCH
- Temas claro y oscuro
- Configuración de Tailwind
- Estilos base

### 8. **components/sidebar.tsx** (Navegación lateral)
- Menú principal de navegación
- Enlaces a todas las secciones
- Botón de logout

---

## 🔄 Flujo Básico de la Aplicación

```
Usuario abre la app
         ↓
    [page.tsx]
    Verifica autenticación
         ↓
    ¿Autenticado?
    ↙           ↘
 Sí            No
  ↓             ↓
[/dashboard]  [/login]
  ↓             ↓
Dashboard    LoginPage
             ↓
          ¿Credenciales válidas?
             ↙           ↘
           Sí            No
            ↓             ↓
    [/dashboard]    Mostrar error
             ↓
    Acceso al dashboard
             ↓
    [dashboard/layout.tsx]
    (Sidebar + Contenido)
             ↓
    [dashboard/page.tsx]
    (Dashboard principal)
```

### Flujo de Autenticación Detallado

1. **Inicio de sesión:**
   - Usuario ingresa email y contraseña
   - Se valida el formato
   - Se almacenan credenciales en `sessionStorage`
   - Se redirige a `/dashboard`

2. **Protección de rutas:**
   - `AuthProvider` en `layout.tsx` verifica el estado
   - Si no está autenticado y no está en `/` o `/login`, redirige a `/login`

3. **Logout:**
   - Se limpian datos de `sessionStorage`
   - Se redirige a `/login`

---

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 16.2.4** - Framework React con SSR
- **React 19** - Librería UI
- **TypeScript 5.7** - Tipado estático

### UI y Estilos
- **Tailwind CSS 4.2** - Utilidades CSS
- **Radix UI** - Componentes accesibles sin estilos
- **Shadcn/ui** - Componentes basados en Radix UI
- **Lucide React** - Iconos SVG

### Gráficos y Tablas
- **Recharts 2.15** - Gráficos interactivos
- **React Resizable Panels** - Paneles redimensionables

### Formularios y Validación
- **React Hook Form 7.54** - Gestión de formularios
- **Zod 3.24** - Validación de esquemas
- **@hookform/resolvers** - Integradores de validación

### Otros
- **date-fns 4.1** - Utilidades de fechas
- **next-themes** - Manejo de temas (claro/oscuro)
- **Sonner** - Notificaciones toast
- **Embla Carousel** - Carrusel de imágenes
- **Vercel Analytics** - Análisis en producción

---

## 🎨 Cómo Modificar la UI

### 1. Modificar Variables de Color (globals.css)

Todas las variables CSS están en `app/globals.css`:

```css
:root {
  --primary: oklch(0.55 0.16 280);      /* Color primario (púrpura) */
  --accent: oklch(0.6 0.2 35);          /* Color de acento (naranja) */
  --background: oklch(0.98 0.002 0);    /* Fondo */
  --foreground: oklch(0.15 0.03 240);   /* Texto */
  /* ... más variables */
}
```

**Para cambiar el color primario:**

1. Abre `app/globals.css`
2. Cambia el valor en `--primary: oklch(...)`
3. El cambio se aplicará automáticamente en toda la app

**Formato OKLCH:** `oklch(lightness saturation hue)`
- Lightness: 0-1 (0=negro, 1=blanco)
- Saturation: 0-0.4
- Hue: 0-360 (grados de color)

### 2. Crear un Componente de UI

Ejemplo: Crear un botón personalizado

```typescript
// components/ui/custom-button.tsx
import { ButtonHTMLAttributes } from 'react'

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export function CustomButton({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: CustomButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-colors'
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
  }
  
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
}
```

### 3. Usar Tailwind CSS para Estilos

**Directamente en JSX:**

```tsx
<div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
  <h2 className="text-lg font-semibold text-foreground mb-2">Título</h2>
  <p className="text-sm text-muted-foreground">Descripción</p>
</div>
```

**Clases disponibles (de variables CSS):**
- Colores: `bg-primary`, `text-foreground`, `border-border`, etc.
- Espaciado: `p-4`, `m-2`, `gap-3`, etc.
- Tamaños: `w-full`, `h-12`, etc.
- Bordes: `border`, `rounded-lg`, `border-border`
- Sombras: `shadow`, `shadow-md`, `shadow-lg`

### 4. Modificar Componentes Existentes

**Ejemplo: Cambiar el MetricCard**

```typescript
// components/metric-card.tsx
interface MetricCardProps {
  title: string
  value: string
  change: string
  changeLabel: string
  description: string
  highlight?: boolean
  icon?: React.ReactNode  // Agregar prop para icono
}

export function MetricCard({
  // ... props anteriores
  icon,
}: MetricCardProps) {
  return (
    <div className="bg-card border rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
      {/* ... resto del componente */}
    </div>
  )
}
```

### 5. Agregar una Nueva Página

**Pasos:**

1. Crea la carpeta en `app/dashboard/nueva-pagina/`
2. Crea el archivo `page.tsx`:

```typescript
// app/dashboard/nueva-pagina/page.tsx
'use client'

import { useAuth } from '@/lib/auth-context'

export default function NuevaPagina() {
  const { userEmail } = useAuth()

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-foreground mb-6">Nueva Página</h1>
      {/* Contenido aquí */}
    </div>
  )
}
```

3. Agrega el enlace en `components/sidebar.tsx`:

```typescript
<Link href="/dashboard/nueva-pagina" className={`...`}>
  <Icon className="w-5 h-5" />
  Nueva Página
</Link>
```

### 6. Personalizar el Tema (Dark/Light)

El sistema de temas está configurado con `next-themes`. Los temas se definen en `globals.css`:

```css
:root {
  /* Tema claro */
  --background: oklch(0.98 0.002 0);
  /* ... */
}

.dark {
  /* Tema oscuro */
  --background: oklch(0.12 0.02 240);
  /* ... */
}
```

Para cambiar entre temas, usa:

```typescript
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Cambiar tema
    </button>
  )
}
```

---

## 🧩 Componentes Principales

### MetricCard
Tarjeta que muestra una métrica con tendencia

```tsx
<MetricCard
  title="Total Stock Value"
  value="$124,580"
  change="+12.5%"
  changeLabel="vs last month"
  description="Current inventory value"
  highlight={false}
/>
```

### ChartCard
Contenedor para gráficos

```tsx
<ChartCard title="Inventory Value Trend" subtitle="Last 12 months">
  {/* Gráfico Recharts */}
</ChartCard>
```

### ProductTable
Tabla de productos

```tsx
<ProductTable />
```

### StockAlerts
Panel de alertas de stock bajo

```tsx
<StockAlerts />
```

### Sidebar
Navegación principal

```tsx
<Sidebar />
```

---

## 🎨 Guía de Estilo

### Paleta de Colores

| Variable | Uso | Valor |
|----------|-----|-------|
| `--primary` | Botones, enlaces | Púrpura |
| `--accent` | Destacados, alertas | Naranja |
| `--destructive` | Acciones destructivas | Rojo |
| `--background` | Fondo de la página | Blanco/Gris oscuro |
| `--foreground` | Texto principal | Negro/Blanco |
| `--card` | Fondos de tarjetas | Blanco/Gris más oscuro |
| `--border` | Bordes | Gris claro/oscuro |
| `--muted-foreground` | Texto secundario | Gris |

### Espaciado

Usa clases de Tailwind:
- `p-4` - Padding interno
- `m-2` - Margin externo
- `gap-3` - Espacio entre items flex
- `space-y-4` - Espacio vertical entre hermanos

### Tipografía

```tsx
// Encabezados
<h1 className="text-4xl font-bold">Encabezado 1</h1>
<h2 className="text-2xl font-semibold">Encabezado 2</h2>

// Cuerpo
<p className="text-base text-foreground">Párrafo normal</p>
<p className="text-sm text-muted-foreground">Texto secundario</p>
```

### Bordes y Esquinas

```tsx
<div className="border border-border rounded-lg">
  Contenido
</div>

// Variantes
<div className="rounded-none">No redondeado</div>
<div className="rounded-sm">Muy poco redondeado</div>
<div className="rounded-lg">Redondeado (default)</div>
<div className="rounded-full">Circulares</div>
```

---

## 📝 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Inicia el servidor de desarrollo

# Build
npm run build            # Compila para producción
npm start                # Inicia el servidor de producción

# Linting
npm run lint             # Ejecuta ESLint

# Instalar nuevos paquetes
npm install package-name
npm install -D dev-package-name  # Para dependencias de desarrollo

# Git
git status               # Ver estado del repositorio
git add .                # Agregar cambios
git commit -m "mensaje"  # Hacer commit
git push                 # Enviar cambios
```

---

## 📚 Recursos Útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [Shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org)
- [React Hook Form](https://react-hook-form.com)
- [TypeScript](https://www.typescriptlang.org/docs)

---

## 🐛 Troubleshooting

### El servidor no inicia

```bash
# Limpia la caché
rm -rf .next
npm run dev
```

### Errores de tipo TypeScript

```bash
# Compila TypeScript para ver errores
npx tsc --noEmit
```

### Puerto 3000 en uso

```bash
# Usa otro puerto
npm run dev -- -p 3001
```

---

## 📧 Contacto y Preguntas

Si tienes preguntas o encuentras problemas, contacta al equipo de desarrollo o abre un issue en GitHub.

**Fecha de creación de documento:** 28 de Abril de 2026
**Última actualización:** 28 de Abril de 2026

---

## 📄 Notas Adicionales

- El proyecto usa **sessionStorage** para almacenar el estado de autenticación (no persistente)
- Para implementar persistencia real, considera usar una base de datos y cookies
- Los gráficos se renderizan con datos mock; reemplaza con datos reales desde un API
- Los temas se aplican globalmente a través de variables CSS en `globals.css`

¡Bienvenido al equipo de desarrollo! 🚀
