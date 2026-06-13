import {
  Users, Flame, FileText, Clock, UserCheck, AlertTriangle, DollarSign, Calendar
} from 'lucide-react'
import MetricCard from '@/components/ui/MetricCard'
import StatusBadge from '@/components/ui/StatusBadge'
import ProjectBadge from '@/components/ui/ProjectBadge'
import TemperatureBadge from '@/components/ui/TemperatureBadge'
import PriorityBadge from '@/components/ui/PriorityBadge'
import { mockLeads, mockTasks, mockProposals } from '@/lib/mock-data'
import { formatDate, formatCurrency, isOverdue } from '@/lib/utils'
import Link from 'next/link'

export default function DashboardPage() {
  const today = new Date().toISOString().split('T')[0]

  const activeLeads = mockLeads.filter(l => l.commercial_status !== 'Perdido' && l.commercial_status !== 'Pausado' && !l.is_client)
  const hotLeads = mockLeads.filter(l => l.temperature === 'Caliente' && !l.is_client)
  const sentProposals = mockProposals.filter(p => p.status === 'Enviada' || p.status === 'Vista')
  const pendingFollowups = mockLeads.filter(l => l.follow_up_date && l.follow_up_date <= today && l.commercial_status !== 'Perdido')
  const activeClients = mockLeads.filter(l => l.is_client)
  const overdueTasks = mockTasks.filter(t => t.status === 'Vencido' || (t.due_date && isOverdue(t.due_date) && t.status !== 'Hecho'))
  const todayTasks = mockTasks.filter(t => t.due_date === today && t.status !== 'Hecho')
  const pipelineValue = mockLeads.filter(l => !l.is_client).reduce((sum, l) => sum + (l.estimated_value ?? 0), 0)

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#71717a] mt-1">Vista general de la operación comercial Alpha.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Leads activos"
          value={activeLeads.length}
          subtitle="Sin cerrar ni perder"
          icon={Users}
          iconColor="text-blue-400"
          accent="#3B82F6"
        />
        <MetricCard
          title="Leads calientes"
          value={hotLeads.length}
          subtitle="No dejar enfriar"
          icon={Flame}
          iconColor="text-red-400"
          accent="#EF4444"
        />
        <MetricCard
          title="Propuestas enviadas"
          value={sentProposals.length}
          subtitle="Esperando respuesta"
          icon={FileText}
          iconColor="text-orange-400"
          accent="#F97316"
        />
        <MetricCard
          title="Seguimientos hoy"
          value={pendingFollowups.length}
          subtitle="Con fecha de hoy o vencidos"
          icon={Clock}
          iconColor="text-amber-400"
          accent="#F59E0B"
        />
        <MetricCard
          title="Clientes activos"
          value={activeClients.length}
          subtitle="Contratos en curso"
          icon={UserCheck}
          iconColor="text-emerald-400"
          accent="#10B981"
        />
        <MetricCard
          title="Tareas vencidas"
          value={overdueTasks.length}
          subtitle="Requieren acción"
          icon={AlertTriangle}
          iconColor="text-red-400"
          accent="#EF4444"
        />
        <MetricCard
          title="Pipeline estimado"
          value={formatCurrency(pipelineValue)}
          subtitle="Valor total de leads activos"
          icon={DollarSign}
          iconColor="text-[#3B82F6]"
          accent="#3B82F6"
        />
        <MetricCard
          title="Tareas para hoy"
          value={todayTasks.length}
          subtitle="Agendadas para hoy"
          icon={Calendar}
          iconColor="text-violet-400"
          accent="#8B5CF6"
        />
      </div>

      {/* Main panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Hoy tenés que hacer */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Hoy tenés que hacer</h2>
              <p className="text-xs text-[#71717a] mt-0.5">{todayTasks.length > 0 ? `${todayTasks.length} tarea${todayTasks.length > 1 ? 's' : ''} para hoy` : 'No hay tareas para hoy'}</p>
            </div>
            <Link href="/tasks" className="text-xs text-[#71717a] hover:text-white transition-colors">Ver todas →</Link>
          </div>
          <div className="divide-y divide-[#1a1a1a]">
            {todayTasks.length === 0 && overdueTasks.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-[#71717a]">No hay tareas pendientes para hoy</div>
            ) : (
              [...todayTasks, ...overdueTasks.filter(t => !todayTasks.includes(t))].slice(0, 6).map(task => (
                <div key={task.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-white truncate">{task.title}</span>
                      {task.status === 'Vencido' && (
                        <span className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded-full shrink-0">Vencido</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {task.lead && <span className="text-xs text-[#71717a]">{task.lead.first_name} {task.lead.last_name}</span>}
                      <ProjectBadge project={task.alpha_project} size="sm" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge priority={task.priority} size="sm" />
                    {task.due_date && <span className="text-xs text-[#71717a]">{formatDate(task.due_date, { day: '2-digit', month: 'short' })}</span>}
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
          <div className="px-5 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Leads que no enfriar</h2>
              <p className="text-xs text-[#71717a] mt-0.5">Temperatura caliente</p>
            </div>
            <Link href="/leads" className="text-xs text-[#71717a] hover:text-white transition-colors">Ver todos →</Link>
          </div>
          <div className="divide-y divide-[#1a1a1a]">
            {hotLeads.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-[#71717a]">Sin leads calientes ahora</div>
            ) : (
              hotLeads.map(lead => (
                <Link key={lead.id} href={`/leads/${lead.id}`} className="block px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-sm text-white font-medium">{lead.first_name} {lead.last_name}</span>
                    <TemperatureBadge temperature={lead.temperature} size="sm" />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Propuestas pendientes */}
        <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Propuestas esperando respuesta</h2>
              <p className="text-xs text-[#71717a] mt-0.5">{sentProposals.length} propuesta{sentProposals.length !== 1 ? 's' : ''} enviada{sentProposals.length !== 1 ? 's' : ''}</p>
            </div>
            <Link href="/proposals" className="text-xs text-[#71717a] hover:text-white transition-colors">Ver todas →</Link>
          </div>
          <div className="divide-y divide-[#1a1a1a]">
            {sentProposals.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-[#71717a]">No hay propuestas pendientes</div>
            ) : (
              sentProposals.map(p => (
                <div key={p.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{p.lead?.first_name} {p.lead?.last_name}</p>
                    <p className="text-xs text-[#71717a] mt-0.5">{p.title}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-sm font-medium text-white">{formatCurrency(p.amount, p.currency)}</span>
                    <span className="text-xs text-[#71717a]">Enviada {formatDate(p.sent_date, { day: '2-digit', month: 'short' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1a1a1a]">
            <h2 className="text-sm font-semibold text-white">Actividad reciente</h2>
            <p className="text-xs text-[#71717a] mt-0.5">Últimos movimientos</p>
          </div>
          <div className="divide-y divide-[#1a1a1a]">
            {[...mockLeads].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 5).map(lead => (
              <Link key={lead.id} href={`/leads/${lead.id}`} className="block px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-white">{lead.first_name} {lead.last_name}</p>
                    <p className="text-xs text-[#71717a] mt-0.5 truncate">{lead.quick_notes ?? 'Sin notas'}</p>
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
    </div>
  )
}
