'use client'

import { useState, useEffect } from 'react'
import { CheckCheck, X } from 'lucide-react'
import { getLeads, loadLeads, onLeadsChange, updateLead } from '@/lib/store'
import { Lead } from '@/types'

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const STORAGE_KEY = 'alphaflow_last_rollover_month'

function currentMonthKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export default function MonthlyRolloverModal() {
  const [show, setShow] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const last = localStorage.getItem(STORAGE_KEY)
    const current = currentMonthKey()
    if (last === current) return

    loadLeads()
    const unsub = onLeadsChange(() => {
      const clients = getLeads().filter(l => l.is_client || l.commercial_status === 'Cliente activo')
      if (clients.length === 0) {
        localStorage.setItem(STORAGE_KEY, current)
        return
      }
      setLeads(clients)
      const init: Record<string, boolean> = {}
      clients.forEach(c => { init[c.id] = true })
      setChecked(init)
      setShow(true)
    })
    return unsub
  }, [])

  async function handleConfirm() {
    setSaving(true)
    const current = currentMonthKey()
    const toDeactivate = leads.filter(l => !checked[l.id])
    await Promise.all(
      toDeactivate.map(l =>
        updateLead(l.id, { is_client: false, commercial_status: 'Perdido' })
      )
    )
    localStorage.setItem(STORAGE_KEY, current)
    setSaving(false)
    setShow(false)
  }

  function handleSkip() {
    localStorage.setItem(STORAGE_KEY, currentMonthKey())
    setShow(false)
  }

  if (!show || leads.length === 0) return null

  const now = new Date()
  const monthName = MONTHS[now.getMonth()]
  const year = now.getFullYear()

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md bg-[#0d0d0d] border border-[#242424] rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#1a1a1a]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-[#3B82F6] font-medium uppercase tracking-wide mb-1">Nuevo mes</p>
              <h2 className="text-lg font-bold text-white">Bienvenido a {monthName} {year}</h2>
              <p className="text-sm text-[#71717a] mt-1">¿Cuáles de tus clientes siguen activos este mes?</p>
            </div>
            <button onClick={handleSkip} className="w-7 h-7 rounded-md flex items-center justify-center text-[#3f3f46] hover:text-white hover:bg-white/5 transition-all shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Client list */}
        <div className="px-6 py-4 space-y-2 max-h-[50vh] overflow-y-auto">
          {leads.map(lead => (
            <label key={lead.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-[#1a1a1a] hover:border-[#2a2a2a] cursor-pointer transition-all bg-[#111111]"
            >
              <input
                type="checkbox"
                checked={!!checked[lead.id]}
                onChange={e => setChecked(prev => ({ ...prev, [lead.id]: e.target.checked }))}
                className="w-4 h-4 accent-[#3B82F6] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{lead.first_name} {lead.last_name}</p>
                {lead.company && <p className="text-xs text-[#71717a] truncate">{lead.company}</p>}
              </div>
              <span className="text-xs text-[#3f3f46] shrink-0">{lead.alpha_project}</span>
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1a1a1a] space-y-3">
          <p className="text-xs text-[#3f3f46]">Los que desmarcás quedan marcados como Perdido.</p>
          <div className="flex gap-2">
            <button onClick={handleSkip}
              className="flex-1 py-2.5 rounded-lg text-sm text-[#71717a] border border-[#242424] hover:bg-white/[0.03] transition-all">
              Omitir
            </button>
            <button onClick={handleConfirm} disabled={saving}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {saving ? 'Guardando...' : <><CheckCheck className="w-4 h-4" /> Confirmar</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
