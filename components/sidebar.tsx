/**
 * COMPONENTE: Sidebar
 * 
 * PROPÓSITO:
 * - Navegación principal del dashboard
 * - Menú con enlaces a todas las secciones
 * - Resalta sección actual
 * - Botón de logout
 * 
 * ⚠️ SEGURO PARA MODIFICAR: SÍ
 * - ✅ Agregar/remover enlaces de navegación
 * - ✅ Cambiar íconos, colores, layout
 * - ✅ Cambiar orden de menús
 * - ❌ NO cambiar isActive logic sin verificar
 * 
 * CONEXIONES:
 * - Usado en: app/dashboard/layout.tsx
 * - Lee de: usePathname() → ruta actual para highlight
 * - Lee de: useAuth() → logout()
 * - Styling: Variables CSS --sidebar-* de globals.css
 * 
 * RUTAS DISPONIBLES:
 * - /dashboard → Dashboard principal
 * - /dashboard/inventory → Gestión de inventario
 * - /dashboard/products → Catálogo de productos
 * - /dashboard/reports → Reportes (placeholder)
 * - /dashboard/suppliers → Proveedores (placeholder)
 * - /dashboard/settings → Configuración (placeholder)
 * - /dashboard/help → Ayuda (placeholder)
 * 
 * IMPORTANTE:
 * - isActive() compara pathname con path del enlace
 * - Resalta exacamente si es /dashboard (no si es /dashboard/*)
 * - Resalta si pathname contiene el path
 */

'use client'

import { LayoutDashboard, Package, ArrowUpDown, BarChart3, Users, Tags, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  /**
   * FUNCIÓN: isActive
   * - Comprueba si la ruta actual coincide con el enlace
   * - Retorna true para resaltar el enlace
   * - Lógica: pathname === path O pathname.startsWith(path + '/')
   */
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <img src="/logo-sidebar.png" alt="Logo" />
          </div>
          <div className="font-bold text-lg text-sidebar-foreground">Inventory.IES</div>
        </div>
      </div>

      {/* Main Menu */}
      <div className="p-4 space-y-2">
        <div className="text-xs font-semibold text-sidebar-accent px-2 py-2 uppercase tracking-wider">
          Menu
        </div>
        <nav className="space-y-1">
          {/* Dashboard */}
          <Link 
            href="/dashboard" 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive('/dashboard') && pathname === '/dashboard' 
                ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                : 'hover:bg-sidebar-accent text-sidebar-foreground'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          {/* Inventory */}
          <Link 
            href="/dashboard/movements" 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive('/dashboard/movements') 
                ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium' 
                : 'hover:bg-sidebar-accent text-sidebar-foreground'
            }`}
          >
            <ArrowUpDown className="w-5 h-5" />
            Movimientos
          </Link>

          {/* Products */}
          <Link 
            href="/dashboard/products" 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive('/dashboard/products') 
                ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium' 
                : 'hover:bg-sidebar-accent text-sidebar-foreground'
            }`}
          >
            <Package className="w-5 h-5" />
            Productos
          </Link>

          {/* Reports */}
          <Link 
            href="/dashboard/reports" 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive('/dashboard/reports') 
                ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium' 
                : 'hover:bg-sidebar-accent text-sidebar-foreground'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Reportes
          </Link>

          {/* Suppliers */}
          <Link 
            href="/dashboard/users" 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive('/dashboard/users') 
                ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium' 
                : 'hover:bg-sidebar-accent text-sidebar-foreground'
            }`}
          >
            <Users className="w-5 h-5" />
            Usuarios
          </Link>
        </nav>
      </div>

      {/* Secondary Menu */}
      <div className="p-4 space-y-2">
        <div className="text-xs font-semibold text-sidebar-accent px-2 py-2 uppercase tracking-wider">
          Others
        </div>
        <nav className="space-y-1">
          {/* Settings */}
          <Link 
            href="/dashboard/categories" 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive('/dashboard/categories') 
                ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium' 
                : 'hover:bg-sidebar-accent text-sidebar-foreground'
            }`}
          >
            <Tags className="w-5 h-5" />
            Categorías
          </Link>

          {/* Help */}
      
        </nav>
      </div>

      {/* Logout - Fijado al fondo */}
      <div className="p-4 border-t border-sidebar-border mt-auto">
        <button 
          onClick={logout} 
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground text-sm transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
