'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { UserCheck } from 'lucide-react'
import ProjectBadge from '@/components/ui/ProjectBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import EmptyState from '@/components/ui/EmptyState'
import { getLeads, loadLeads, onLeadsChange } from '@/lib/store'
import { formatDate, getInitials } from '@/lib/utils'
import { Lead } from '@/types'

export default function ClientsPage() {
  const [leads, setLeads] = useState<Lead[]>([])

  useEffect(() => {
    loadLeads()
    return onLeadsChange(() => setLeads(getLeads()))
  }, [])

  // Cliente = is_client true O commercial_status = 'Cliente activo'
  const clients = leads.filter(l => l.is_client || l.commercial_status === 'Cliente activo')

  return (
    <div className="max-w-[1100px] mx-auto space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Clientes activos</h1>
        <p className="text-sm text-[#71717a] mt-1">{clients.length} cliente{clients.length !== 1 ? 's' : ''} en curso</p>
      </div>

      {clients.length === 0 ? (
        <div className="bg-[#111111] border border-[#242424] rounded-xl">
          <EmptyState icon={UserCheck} title="Sin clientes activos" description="Cuando un lead tenga estado 'Cliente activo', aparecerá aquí." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map(client => (
            <Link key={client.id} href={`/leads/${client.id}`}
              className="bg-[#111111] border border-[#242424] rounded-xl p-5 hover:border-[#2a2a2a] transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-sm font-semibold text-[#a1a1aa] shrink-0">
                  {getInitials(client.first_name, client.last_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{client.first_name} {client.last_name}</p>
                  {client.company && <p className="text-xs text-[#71717a]">{client.company}</p>}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <ProjectBadge project={client.alpha_project} size="sm" />
                    <StatusBadge status={client.commercial_status} size="sm" />
                  </div>
                </div>
                <span className="text-[#3f3f46] group-hover:text-white transition-colors">→</span>
              </div>
              {client.service_interested && (
                <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
                  <p className="text-xs text-[#71717a]">Servicio: <span className="text-[#a1a1aa]">{client.service_interested}</span></p>
                </div>
              )}
              {client.follow_up_date && (
                <div className="mt-2">
                  <p className="text-xs text-[#3B82F6]">Seguimiento: {formatDate(client.follow_up_date, { day: '2-digit', month: 'short' })}</p>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
