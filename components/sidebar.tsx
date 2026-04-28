import { LayoutDashboard, Package, Boxes, TrendingUp, Users, Settings, HelpCircle, LogOut } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Package className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div className="font-bold text-lg text-sidebar-foreground">INVENTO</div>
        </div>
      </div>

      {/* Menu */}
      <div className="p-4 space-y-2">
        <div className="text-xs font-semibold text-sidebar-accent px-2 py-2 uppercase tracking-wider">
          Menu
        </div>
        <nav className="space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground text-sm transition-colors">
            <Boxes className="w-5 h-5" />
            Inventory
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground text-sm transition-colors">
            <Package className="w-5 h-5" />
            Products
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground text-sm transition-colors">
            <TrendingUp className="w-5 h-5" />
            Reports
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground text-sm transition-colors">
            <Users className="w-5 h-5" />
            Suppliers
          </a>
        </nav>
      </div>

      {/* Others */}
      <div className="p-4 space-y-2">
        <div className="text-xs font-semibold text-sidebar-accent px-2 py-2 uppercase tracking-wider">
          Others
        </div>
        <nav className="space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground text-sm transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground text-sm transition-colors">
            <HelpCircle className="w-5 h-5" />
            Help
          </a>
        </nav>
      </div>

      {/* Logout - Push to bottom */}
      <div className="p-4 border-t border-sidebar-border mt-auto">
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground text-sm transition-colors w-full">
          <LogOut className="w-5 h-5" />
          Logout
        </a>
      </div>
    </div>
  )
}
