'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, UserCheck, CheckSquare, Briefcase,
  Mail, FileText, BarChart2, Settings, Zap, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/clients', label: 'Clientes', icon: UserCheck },
  { href: '/tasks', label: 'Tareas', icon: CheckSquare },
  { href: '/services', label: 'Servicios', icon: Briefcase },
  { href: '/emails', label: 'Mails', icon: Mail },
  { href: '/proposals', label: 'Propuestas', icon: FileText },
  { href: '/reports', label: 'Reportes', icon: BarChart2 },
]

interface Props {
  open?: boolean
  onClose?: () => void
}

export default function Sidebar({ open = false, onClose }: Props) {
  const pathname = usePathname()

  const content = (
    <aside className="w-[220px] shrink-0 flex flex-col h-full border-r border-[#1a1a1a] bg-[#080808]">
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-[#3B82F6]" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-white">AlphaFlow</span>
        </div>
        {/* Close button — only on mobile */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden w-7 h-7 rounded-md flex items-center justify-center text-[#71717a] hover:text-white hover:bg-white/5 transition-all">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        <div className="space-y-0.5">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150',
                  active
                    ? 'bg-white/5 text-white'
                    : 'text-[#71717a] hover:text-white hover:bg-white/[0.03]'
                )}
              >
                <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-[#3B82F6]' : 'text-current')} />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Settings */}
      <div className="p-2 border-t border-[#1a1a1a]">
        <Link
          href="/settings"
          onClick={onClose}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150',
            pathname === '/settings'
              ? 'bg-white/5 text-white'
              : 'text-[#71717a] hover:text-white hover:bg-white/[0.03]'
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          Configuración
        </Link>
        <div className="mt-2 px-3 pb-1">
          <span className="text-[10px] text-[#3f3f46] tracking-widest uppercase">v1.0 · MVP</span>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-full">
        {content}
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          {/* Drawer */}
          <div className="relative z-10 h-full">
            {content}
          </div>
        </div>
      )}
    </>
  )
}
