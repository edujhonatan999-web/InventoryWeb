'use client'

import { Search, Bell, User, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useState } from 'react'

export function Header() {
  const { logout, userEmail } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products, suppliers..."
            className="w-full px-4 py-2 pl-10 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4 ml-8">
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
        </button>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center gap-2">
          <span>👤</span>
          Manager
        </button>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <User className="w-5 h-5 text-foreground" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1">
              <div className="px-4 py-2 border-b border-border text-sm text-muted-foreground">
                {userEmail || 'User'}
              </div>
              <button
                onClick={() => {
                  logout()
                  setShowDropdown(false)
                }}
                className="w-full text-left px-4 py-2 hover:bg-muted text-foreground flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
