/**
 * LAYOUT: Dashboard (/dashboard/*)
 * 
 * PROPÓSITO:
 * - Estructura del dashboard (Sidebar + Header + Contenido)
 * - Verifica autenticación y muestra spinner mientras carga
 * - Aplica a todas las subrutas: /dashboard, /inventory, /products, etc
 * 
 * ⚠️ SEGURO PARA MODIFICAR: SÍ
 * - ✅ Cambiar layout de Sidebar/Header (flex, grid, etc)
 * - ✅ Agregar componentes (Toaster, Modal Global, etc)
 * - ❌ NO remover isLoading check (causa pantalla en blanco)
 * - ❌ NO remover useAuth() sin reemplazo
 * 
 * CONEXIONES:
 * - Lee de: useAuth() → lib/auth-context.tsx
 * - Usa: Sidebar (components/sidebar.tsx)
 * - Usa: Header (components/header.tsx)
 * - Envuelve: app/dashboard/page.tsx, /inventory/page.tsx, /products/page.tsx
 * 
 * ESTRUCTURA VISUAL:
 * ┌─────────────────────────────┐
 * │          HEADER             │  components/header.tsx
 * ├────────┬────────────────────┤
 * │        │                    │
 * │ SIDEBAR│   CHILDREN         │  components/sidebar.tsx
 * │        │   (contenido de    │
 * │        │    las páginas)    │
 * │        │                    │
 * └────────┴────────────────────┘
 */

'use client'

import { useAuth } from '@/lib/auth-context'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading } = useAuth();

  // Spinner mientras se verifica autenticación
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar: Navegación principal */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header: Búsqueda, notificaciones, usuario */}
        <Header />
        
        {/* Main Content: Cambia según la ruta */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
