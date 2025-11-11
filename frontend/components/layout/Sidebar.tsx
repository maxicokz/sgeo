'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Globe,
  TrendingUp,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Target,
  BookOpen,
  Activity,
  MessageSquare
} from 'lucide-react'

const menuItems = [
  {
    title: 'Обзор',
    items: [
      {
        title: 'Дашборд',
        href: '/',
        icon: LayoutDashboard,
        badge: null
      },
      {
        title: 'Аналитика',
        href: '/analytics',
        icon: TrendingUp,
        badge: null
      },
      {
        title: 'Активность',
        href: '/activity',
        icon: Activity,
        badge: '5'
      }
    ]
  },
  {
    title: 'Данные',
    items: [
      {
        title: 'Темы',
        href: '/topics',
        icon: FileText,
        badge: '20'
      },
      {
        title: 'Нарративы',
        href: '/narratives',
        icon: MessageSquare,
        badge: '5'
      },
      {
        title: 'Источники',
        href: '/sources',
        icon: Globe,
        badge: null
      },
      {
        title: 'LLM Системы',
        href: '/llm-systems',
        icon: BarChart3,
        badge: '5'
      }
    ]
  },
  {
    title: 'Управление',
    items: [
      {
        title: 'Отчёты',
        href: '/reports',
        icon: BookOpen,
        badge: null
      },
      {
        title: 'Цели',
        href: '/goals',
        icon: Target,
        badge: null
      },
      {
        title: 'Настройки',
        href: '/settings',
        icon: Settings,
        badge: null
      }
    ]
  }
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 border-r border-slate-700/50',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg">SGEO</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-8rem)]">
        {menuItems.map((section, idx) => (
          <div key={idx}>
            {!collapsed && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                        : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r" />
                    )}
                    <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-blue-400')} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 font-medium">{item.title}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
        <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-700/50 transition-colors">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-sm font-bold">АК</span>
          </div>
          {!collapsed && (
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Администратор</p>
              <p className="text-xs text-slate-400">admin@sgeo.kz</p>
            </div>
          )}
        </button>
      </div>
    </aside>
  )
}
