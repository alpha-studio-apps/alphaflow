'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, ChevronRight, ArrowUpDown } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'
import ProjectBadge from '@/components/ui/ProjectBadge'
import TemperatureBadge from '@/components/ui/TemperatureBadge'
import PriorityBadge from '@/components/ui/PriorityBadge'
import EmptyState from '@/components/ui/EmptyState'
import { mockLeads } from '@/lib/mock-data'
import { ALPHA_PROJECTS, COMMERCIAL_STATUSES, TEMPERATURES, PRIORITIES } from '@/lib/constants'
import { formatDate, getInitials } from '@/lib/utils'
import { Lead, AlphaProject, CommercialStatus, Temperature, Priority } from '@/types'
import { Users } from 'lucide-react'

export default function LeadsPage() {
  const [search, setSearch] = useState('')
  const [filterProject, setFilterProject] = useState<AlphaProject | ''>('')
  const [filterStatus, setFilterStatus] = useState<CommercialStatus | ''>('')
  const [filterTemp, setFilterTemp] = useState<Temperature | ''>('')
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('')

  const filtered = mockLeads.filter(lead => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      lead.first_name.toLowerCase().includes(q) ||
      lead.last_name.toLowerCase().includes(q) ||
      (lead.company ?? '').toLowerCase().includes(q) ||
      (lead.email ?? '').toLowerCase().includes(q) ||
      (lead.instagram ?? '').toLowerCase().includes(q)
    const matchProject = !filterProject || lead.alpha_project === filterProject
    const matchStatus = !filterStatus || lead.commercial_status === filterStatus
    const matchTemp = !filterTemp || lead.temperature === filterTemp
    const matchPriority = !filterPriority || lead.priority === filterPriority
    return matchSearch && matchProject && matchStatus && matchTemp && matchPriority
  })

  const activeFilters = [filterProject, filterStatus, filterTemp, filterPriority].filter(Boolean).length

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Leads</h1>
          <p className="text-sm text-[#71717a] mt-1">{filtered.length} de {mockLeads.length} leads</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#111111] border border-[#242424] rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3f3f46]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre, empresa, email..."
              className="w-full bg-[#0d0d0d] border border-[#242424] rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-[#3f3f46] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Select value={filterProject} onChange={v => setFilterProject(v as AlphaProject | '')} placeholder="Proyecto">
              {ALPHA_PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
            </Select>
            <Select value={filterStatus} onChange={v => setFilterStatus(v as CommercialStatus | '')} placeholder="Estado">
              {COMMERCIAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Select value={filterTemp} onChange={v => setFilterTemp(v as Temperature | '')} placeholder="Temperatura">
              {TEMPERATURES.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
            <Select value={filterPriority} onChange={v => setFilterPriority(v as Priority | '')} placeholder="Prioridad">
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </Select>
            {activeFilters > 0 && (
              <button
                onClick={() => { setFilterProject(''); setFilterStatus(''); setFilterTemp(''); setFilterPriority('') }}
                className="px-3 py-2 text-xs text-red-400 border border-red-500/20 bg-red-500/5 rounded-md hover:bg-red-500/10 transition-all"
              >
                Limpiar filtros ({activeFilters})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No se encontraron leads" description="Probá ajustando los filtros o creá un nuevo lead." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  {['Nombre', 'Proyecto', 'Servicio', 'Estado', 'Temperatura', 'Seguimiento', 'Prioridad', 'Valor', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] text-[#71717a] font-medium uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {filtered.map(lead => (
                  <LeadRow key={lead.id} lead={lead} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function LeadRow({ lead }: { lead: Lead }) {
  return (
    <tr className="hover:bg-white/[0.02] transition-colors group">
      {/* Nombre */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-xs font-medium text-[#a1a1aa] shrink-0">
            {getInitials(lead.first_name, lead.last_name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-white font-medium">{lead.first_name} {lead.last_name}</p>
            {lead.company && <p className="text-xs text-[#71717a] truncate">{lead.company}</p>}
          </div>
        </div>
      </td>
      {/* Proyecto */}
      <td className="px-4 py-3">
        <ProjectBadge project={lead.alpha_project} size="sm" />
      </td>
      {/* Servicio */}
      <td className="px-4 py-3">
        <span className="text-xs text-[#a1a1aa] whitespace-nowrap">{lead.service_interested ?? '—'}</span>
      </td>
      {/* Estado */}
      <td className="px-4 py-3">
        <StatusBadge status={lead.commercial_status} size="sm" />
      </td>
      {/* Temperatura */}
      <td className="px-4 py-3">
        <TemperatureBadge temperature={lead.temperature} size="sm" />
      </td>
      {/* Seguimiento */}
      <td className="px-4 py-3">
        <span className="text-xs text-[#a1a1aa] whitespace-nowrap">
          {lead.follow_up_date ? formatDate(lead.follow_up_date, { day: '2-digit', month: 'short' }) : '—'}
        </span>
      </td>
      {/* Prioridad */}
      <td className="px-4 py-3">
        <PriorityBadge priority={lead.priority} size="sm" />
      </td>
      {/* Valor */}
      <td className="px-4 py-3">
        <span className="text-xs text-[#a1a1aa] whitespace-nowrap">
          {lead.estimated_value ? `$${lead.estimated_value.toLocaleString('es-AR')}` : '—'}
        </span>
      </td>
      {/* Action */}
      <td className="px-4 py-3">
        <Link href={`/leads/${lead.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#71717a] hover:text-white">
          <ChevronRight className="w-4 h-4" />
        </Link>
      </td>
    </tr>
  )
}

function Select({ value, onChange, placeholder, children }: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  children: React.ReactNode
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-[#0d0d0d] border border-[#242424] rounded-md px-3 py-2 text-sm text-[#a1a1aa] focus:outline-none focus:border-[#3f3f46] transition-colors appearance-none cursor-pointer"
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  )
}
