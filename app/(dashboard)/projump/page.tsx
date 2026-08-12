'use client'

import { useState, useEffect } from 'react'
import { getLeads, loadLeads, onLeadsChange } from '@/lib/store'
import { Lead } from '@/types'
import { formatDate, formatCurrency } from '@/lib/utils'
import EmptyState from '@/components/ui/EmptyState'
import { ShoppingBag, Search, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function ProJumpPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadLeads()
    return onLeadsChange(() => setLeads(getLeads()))
  }, [])

  // Solo compradores efectivos de ProJump
  const buyers = leads.filter(l =>
    l.alpha_project === 'ProJump' &&
    (l.is_client || l.commercial_status === 'Cliente activo')
  )

  const filtered = buyers.filter(l => {
    const q = search.toLowerCase()
    return !q ||
      l.first_name.toLowerCase().includes(q) ||
      l.last_name.toLowerCase().includes(q) ||
      (l.email ?? '').toLowerCase().includes(q) ||
      (l.phone ?? '').toLowerCase().includes(q)
  })

  const totalRevenue = buyers.reduce((sum, l) => sum + (l.estimated_value ?? 0), 0)
  const thisMonth = new Date().toISOString().slice(0, 7)
  const newThisMonth = buyers.filter(l => l.first_contact_date?.startsWith(thisMonth)).length

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
            style={{ background: '#1a0a2e', border: '1px solid #4c1d95' }}>
            ⚡
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">ProJump — Ventas</h1>
        </div>
        <p className="text-sm text-[#71717a] ml-11">Compradores del programa de entrenamiento</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard icon={Users} label="Total compradores" value={String(buyers.length)} />
        <MetricCard icon={TrendingUp} label="Este mes" value={String(newThisMonth)} accent />
        <MetricCard icon={DollarSign} label="Revenue total" value={`$${totalRevenue.toLocaleString('es-AR')}`} />
        <MetricCard icon={ShoppingBag} label="Ticket promedio" value={buyers.length ? `$${Math.round(totalRevenue / buyers.length).toLocaleString('es-AR')}` : '—'} />
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3f3f46]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, email o teléfono..."
          className="w-full bg-[#111111] border border-[#242424] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-[#3f3f46] transition-colors"
        />
      </div>

      {/* Lista */}
      <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
        {buyers.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Sin compradores todavía"
            description="Cuando alguien compre en Tiendup va a aparecer acá automáticamente."
          />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Search} title="Sin resultados" description="Probá con otro nombre o email." />
        ) : (
          <>
            {/* Header tabla */}
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[#1a1a1a] text-[11px] text-[#71717a] uppercase tracking-wider font-medium">
              <span>Comprador</span>
              <span>Contacto</span>
              <span>Programa / Fecha</span>
              <span>Valor</span>
            </div>

            <div className="divide-y divide-[#1a1a1a]">
              {filtered.map(lead => (
                <Link
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors group items-center"
                >
                  {/* Nombre */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 text-[#C084FC]"
                      style={{ background: '#1a0a2e', border: '1px solid #4c1d95' }}>
                      {lead.first_name[0]}{lead.last_name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{lead.first_name} {lead.last_name}</p>
                      {lead.quick_notes && (
                        <p className="text-xs text-[#3f3f46] truncate">{lead.quick_notes.replace(/\[.*?\]\s?/, '')}</p>
                      )}
                    </div>
                  </div>

                  {/* Contacto */}
                  <div className="min-w-0 space-y-0.5">
                    {lead.email && <p className="text-xs text-[#a1a1aa] truncate">{lead.email}</p>}
                    {lead.phone && <p className="text-xs text-[#71717a]">{lead.phone}</p>}
                  </div>

                  {/* Programa / Fecha */}
                  <div className="min-w-0 space-y-0.5">
                    {lead.service_interested && (
                      <p className="text-xs text-[#a1a1aa] truncate">{lead.service_interested}</p>
                    )}
                    {lead.first_contact_date && (
                      <div className="flex items-center gap-1 text-[#3f3f46]">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span className="text-xs">{formatDate(lead.first_contact_date, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    )}
                  </div>

                  {/* Valor */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-[#C084FC]">
                      ${(lead.estimated_value ?? 22500).toLocaleString('es-AR')}
                    </p>
                    <p className="text-[10px] text-[#3f3f46]">ARS</p>
                  </div>
                </Link>
              ))}
            </div>

            {filtered.length > 0 && (
              <div className="px-5 py-3 border-t border-[#1a1a1a] flex items-center justify-between">
                <span className="text-xs text-[#3f3f46]">{filtered.length} comprador{filtered.length !== 1 ? 'es' : ''}</span>
                <span className="text-xs font-medium text-[#C084FC]">
                  Total filtrado: ${filtered.reduce((s, l) => s + (l.estimated_value ?? 22500), 0).toLocaleString('es-AR')}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, accent }: {
  icon: React.ElementType; label: string; value: string; accent?: boolean
}) {
  return (
    <div className="bg-[#111111] border border-[#242424] rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#71717a]">{label}</span>
        <Icon className={`w-4 h-4 ${accent ? 'text-[#C084FC]' : 'text-[#3f3f46]'}`} />
      </div>
      <p className={`text-xl font-bold ${accent ? 'text-[#C084FC]' : 'text-white'}`}>{value}</p>
    </div>
  )
}
