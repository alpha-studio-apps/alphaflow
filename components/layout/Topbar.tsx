'use client'

import { useState } from 'react'
import { Search, Plus, Menu } from 'lucide-react'
import CreateLeadModal from '@/components/modals/CreateLeadModal'
import CreateTaskModal from '@/components/modals/CreateTaskModal'

interface Props {
  onMenuClick: () => void
}

export default function Topbar({ onMenuClick }: Props) {
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)

  return (
    <>
      <header className="h-14 border-b border-[#1a1a1a] bg-[#080808] flex items-center px-4 gap-3 shrink-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-8 h-8 rounded-md flex items-center justify-center text-[#71717a] hover:text-white hover:bg-white/5 transition-all shrink-0"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3f3f46]" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-[#111111] border border-[#242424] rounded-md pl-9 pr-3 py-1.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-[#3f3f46] transition-colors"
          />
        </div>

        <div className="flex-1 hidden sm:block" />

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Nueva tarea — oculto en mobile muy chico */}
          <button
            onClick={() => setShowTaskModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-[#a1a1aa] border border-[#242424] bg-[#111111] hover:bg-[#161616] hover:text-white transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Nueva tarea</span>
          </button>

          {/* Nuevo lead — siempre visible */}
          <button
            onClick={() => setShowLeadModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-all font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nuevo lead</span>
          </button>
        </div>
      </header>

      <CreateLeadModal open={showLeadModal} onClose={() => setShowLeadModal(false)} />
      <CreateTaskModal open={showTaskModal} onClose={() => setShowTaskModal(false)} />
    </>
  )
}
