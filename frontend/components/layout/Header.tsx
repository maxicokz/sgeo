'use client'

import { Bell, Search, Moon, Sun } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function Header() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-white/80 backdrop-blur-lg">
      <div className="flex h-full items-center justify-between px-6">
        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск тем, источников, отчётов..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          {/* Theme Toggle */}
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Sun className="h-5 w-5 text-slate-600" />
          </button>

          {/* Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-700">Активен</span>
          </div>
        </div>
      </div>
    </header>
  )
}
