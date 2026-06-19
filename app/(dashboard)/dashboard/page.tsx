'use client'

import { useState, useEffect } from 'react'
import {
  Users, Flame, FileText, Clock, UserCheck, AlertTriangle, DollarSign, Calendar
} from 'lucide-react'
import MetricCard from '@/components/ui/MetricCard'
import StatusBadge from '@/components/ui/StatusBadge'
import ProjectBadge from '@/components/ui/ProjectBadge'
import TemperatureBadge from '@/components/ui/TemperatureBadge'
import PriorityBadge from '@/components/ui/PriorityBadge'
import { getLeads, getTasks, getProposals, loadLeads, loadTasks, loadProposals, onLeadsChange, onTasksChange } from '@/lib/store'
import { formatDate, formatCurrency, isOverdue } from '@/lib/utils'
import Link from 'next/link'
import { Lead, Task, Proposal } from '@/types'

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])

  useEffect(() => {
    loadLeads()
    loadTasks()
    loadProposals().then(() => setProposals(getProposals()))
    const u1 = onLeadsChange(() => setLeads(getLeads()))
    const u2 = onTasksChange(() => setTasks(getTasks()))
    return () => { u1(); u2() }
  }, [])

  const today = new Date().toISOString().split('T')[0]

  const activeLeads = leads.filter(l => l.commercial_status !== 'Perdido' && l.commercial_status !== 'Pausado' && !l.is_client)
  const hotLeads = leads.filter(l => l.temperature === 'Caliente' && !l.is_client)
  const sentProposals = proposals.filter(p => p.status === 'Enviada' || p.status === 'Vista')
  const pendingFollowups = leads.filter(l => l.follow_up_date && l.follow_up_date <= today && l.commercial_status !== 'Perdido')
  const activeClients = leads.filter(l => l.is_client)
  const overdueTasks = tasks.filter(t => t.status === 'Vencido' || (t.due_date && isOverdue(t.due_date) && t.status !== 'Hecho'))
  const todayTasks = tasks.filter(t => t.due_date === today && t.status !== 'Hecho')
  const pipelineValue = leads.filter(l => !l.is_client).reduce((sum, l) => sum + (l.estimated_value ?? 0), 0)

  const isEmpty = leads.length === 0 && tasks.length === 0

  return (
    <div className="max-w-[1400px] mx-auto space-y-5 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#71717a] mt-1">Vista general de la operación comercial Alpha.</p>
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center mx-auto mb-4">
            <Users className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">Todo listo para empezar</h3>
          <p className="text-xs text-[#71717a] max-w-xs mx-auto">Todavía no hay datos. Hacé click en "Nuevo lead" arriba para cargar tu primer contacto.</p>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <MetricCard title="Leads activos" value={activeLeads.length} subtitle="Sin cerrar ni perder" icon={Users} iconColor="text-blue-400" accent="#3B82F6" />
        <MetricCard title="Leads calientes" value={hotLeads.length} subtitle="No dejar enfriar" icon={Flame} iconColor="text-red-400" accent="#EF4444" />
        <MetricCard title="Propuestas" value={sentProposals.length} subtitle="Esperando respuesta" icon={FileText} iconColor="text-orange-400" accent="#F97316" />
        <MetricCard title="Seguimientos" value={pendingFollowups.length} subtitle="Con fecha vencida o hoy" icon={Clock} iconColor="text-amber-400" accent="#F59E0B" />
        <MetricCard title="Clientes activos" value={activeClients.length} subtitle="Contratos en curso" icon={UserCheck} iconColor="text-emerald-400" accent="#10B981" />
        <MetricCard title="Tareas vencidas" value={overdueTasks.length} subtitle="Requieren acción" icon={AlertTriangle} iconColor="text-red-400" accent="#EF4444" />
        <MetricCard title="Pipeline" value={formatCurrency(pipelineValue)} subtitle="Valor total estimado" icon={DollarSign} iconColor="text-[#3B82F6]" accent="#3B82F6" />
        <MetricCard title="Tareas hoy" value={todayTasks.length} subtitle="Agendadas para hoy" icon={Calendar} iconColor="text-violet-400" accent="#8B5CF6" />
      </div>

      {!isEmpty && (
        <>
          {/* Main panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
            {/* Hoy */}
            <div className="lg:col-span-2 bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
              <div className="px-4 md:px-5 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">Hoy tenés que hacer</h2>
                  <p className="text-xs text-[#71717a] mt-0.5">
                    {todayTasks.length > 0 ? `${todayTasks.length} tarea${todayTasks.length > 1 ? 's' : ''} para hoy` : 'No hay tareas para hoy'}
                  </p>
                </div>
                <Link href="/tasks" className="text-xs text-[#71717a] hover:text-white transition-colors shrink-0">Ver todas →</Link>
              </div>
              <div className="divide-y divide-[#1a1a1a]">
                {todayTasks.length === 0 && overdueTasks.length === 0 ? (
                  <div className="px-5 py-10 text-center text-sm text-[#71717a]">No hay tareas pendientes</div>
                ) : (
                  [...todayTasks, ...overdueTasks.filter(t => !todayTasks.includes(t))].slice(0, 6).map(task => (
                    <div key={task.id} className="px-4 md:px-5 py-3.5 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm text-white truncate">{task.title}</span>
                          {task.status === 'Vencido' && (
                            <span className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded-full shrink-0">Vencido</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {task.lead && <span className="text-xs text-[#71717a]">{task.lead.first_name} {task.lead.last_name}</span>}
                          <ProjectBadge project={task.alpha_project} size="sm" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <PriorityBadge priority={task.priority} size="sm" />
                        {task.due_date && <span className="text-xs text-[#71717a] hidden sm:block">{formatDate(task.due_date, { day: '2-digit', month: 'short' })}</span>}
                      </div>
                      {task.lead && (
                        <Link href={`/leads/${task.lead_id}`} className="shrink-0 text-xs text-[#3f3f46] hover:text-white transition-colors">→</Link>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Leads calientes */}
            <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
              <div className="px-4 md:px-5 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">Leads que no enfriar</h2>
                  <p className="text-xs text-[#71717a] mt-0.5">Temperatura caliente</p>
                </div>
                <Link href="/leads" className="text-xs text-[#71717a] hover:text-white transition-colors shrink-0">Ver todos →</Link>
              </div>
              <div className="divide-y divide-[#1a1a1a]">
                {hotLeads.length === 0 ? (
                  <div className="px-5 py-10 text-center text-sm text-[#71717a]">Sin leads calientes</div>
                ) : (
                  hotLeads.map(lead => (
                    <Link key={lead.id} href={`/leads/${lead.id}`} className="block px-4 md:px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-sm text-white font-medium">{lead.first_name} {lead.last_name}</span>
                        <TemperatureBadge temperature={lead.temperature} size="sm" />
                      </div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <ProjectBadge project={lead.alpha_project} size="sm" />
                      </div>
                      <StatusBadge status={lead.commercial_status} size="sm" />
                      {lead.follow_up_date && (
                        <p className="text-[11px] text-[#71717a] mt-1.5">Seguimiento: {formatDate(lead.follow_up_date, { day: '2-digit', month: 'short' })}</p>
                      )}
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Bottom panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {/* Propuestas */}
            <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
              <div className="px-4 md:px-5 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">Propuestas esperando respuesta</h2>
                  <p className="text-xs text-[#71717a] mt-0.5">{sentProposals.length} enviada{sentProposals.length !== 1 ? 's' : ''}</p>
                </div>
                <Link href="/proposals" className="text-xs text-[#71717a] hover:text-white transition-colors shrink-0">Ver todas →</Link>
              </div>
              <div className="divide-y divide-[#1a1a1a]">
                {sentProposals.length === 0 ? (
                  <div className="px-5 py-10 text-center text-sm text-[#71717a]">No hay propuestas pendientes</div>
                ) : (
                  sentProposals.map(p => (
                    <div key={p.id} className="px-4 md:px-5 py-3.5 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">{p.lead?.first_name} {p.lead?.last_name}</p>
                        <p className="text-xs text-[#71717a] mt-0.5 truncate">{p.title}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-sm font-medium text-white">{formatCurrency(p.amount, p.currency)}</span>
                        <span className="text-xs text-[#71717a]">{formatDate(p.sent_date, { day: '2-digit', month: 'short' })}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Actividad reciente */}
            <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
              <div className="px-4 md:px-5 py-4 border-b border-[#1a1a1a]">
                <h2 className="text-sm font-semibold text-white">Actividad reciente</h2>
                <p className="text-xs text-[#71717a] mt-0.5">Últimos movimientos</p>
              </div>
              <div className="divide-y divide-[#1a1a1a]">
                {[...leads].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 5).map(lead => (
                  <Link key={lead.id} href={`/leads/${lead.id}`} className="block px-4 md:px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-white">{lead.first_name} {lead.last_name}</p>
                        <p className="text-xs text-[#71717a] mt-0.5 truncate">{lead.quick_notes ?? lead.service_interested ?? '—'}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <StatusBadge status={lead.commercial_status} size="sm" />
                        <span className="text-[11px] text-[#71717a]">{formatDate(lead.updated_at, { day: '2-digit', month: 'short' })}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
