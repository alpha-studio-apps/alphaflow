'use client'

import { useState, useEffect } from 'react'
import {
  Users, Flame, FileText, Clock, UserCheck, AlertTriangle, DollarSign, Calendar,
  ShoppingBag, TrendingUp, CheckCircle2, AlertCircle, Info, ChevronRight
} from 'lucide-react'
import MetricCard from '@/components/ui/MetricCard'
import StatusBadge from '@/components/ui/StatusBadge'
import ProjectBadge from '@/components/ui/ProjectBadge'
import TemperatureBadge from '@/components/ui/TemperatureBadge'
import { getLeads, getTasks, getProposals, loadLeads, loadTasks, loadProposals, onLeadsChange, onTasksChange } from '@/lib/store'
import { formatDate, formatCurrency, isOverdue } from '@/lib/utils'
import Link from 'next/link'
import { Lead, Task, Proposal } from '@/types'

type Tip = { level: 'urgent' | 'warning' | 'info'; text: string; href?: string }

function buildTips(leads: Lead[], tasks: Task[], proposals: Proposal[], today: string): Tip[] {
  const tips: Tip[] = []
  const thisMonth = today.slice(0, 7)
  const sevenDaysAgo = new Date(Date.now() - 7 * 864e5).toISOString().split('T')[0]
  const fourteenDaysAgo = new Date(Date.now() - 14 * 864e5).toISOString().split('T')[0]

  // Seguimientos vencidos
  const vencidos = leads.filter(l => l.follow_up_date && l.follow_up_date < today && l.commercial_status !== 'Perdido' && l.commercial_status !== 'Pausado')
  if (vencidos.length > 0) tips.push({ level: 'urgent', text: `${vencidos.length} seguimiento${vencidos.length > 1 ? 's' : ''} vencido${vencidos.length > 1 ? 's' : ''} — reagendá o cerrá`, href: '/leads' })

  // Tareas vencidas
  const overdue = tasks.filter(t => t.due_date && isOverdue(t.due_date) && t.status !== 'Hecho')
  if (overdue.length > 0) tips.push({ level: 'urgent', text: `${overdue.length} tarea${overdue.length > 1 ? 's' : ''} vencida${overdue.length > 1 ? 's' : ''} sin completar`, href: '/tasks' })

  // Propuestas viejas sin respuesta
  const oldProposals = proposals.filter(p => (p.status === 'Enviada' || p.status === 'Vista') && p.sent_date && p.sent_date < sevenDaysAgo)
  if (oldProposals.length > 0) tips.push({ level: 'warning', text: `${oldProposals.length} propuesta${oldProposals.length > 1 ? 's' : ''} sin respuesta hace más de 7 días`, href: '/proposals' })

  // Leads calientes sin seguimiento agendado
  const hotNoFollowup = leads.filter(l => l.temperature === 'Caliente' && !l.is_client && !l.follow_up_date)
  if (hotNoFollowup.length > 0) tips.push({ level: 'warning', text: `${hotNoFollowup.length} lead${hotNoFollowup.length > 1 ? 's' : ''} caliente${hotNoFollowup.length > 1 ? 's' : ''} sin seguimiento agendado`, href: '/leads' })

  // Clientes sin actividad en 14 días
  const clientesInactivos = leads.filter(l => l.is_client && l.updated_at && l.updated_at.split('T')[0] < fourteenDaysAgo)
  if (clientesInactivos.length > 0) tips.push({ level: 'warning', text: `${clientesInactivos.length} cliente${clientesInactivos.length > 1 ? 's' : ''} sin actividad en más de 14 días — ¿todo bien con el servicio?`, href: '/clients' })

  // Nuevos leads sin primer contacto (sin nota ni seguimiento)
  const sinContactar = leads.filter(l => !l.is_client && l.commercial_status === 'Nuevo lead' && l.first_contact_date && l.first_contact_date >= sevenDaysAgo && !l.follow_up_date && !l.quick_notes)
  if (sinContactar.length > 0) tips.push({ level: 'warning', text: `${sinContactar.length} lead${sinContactar.length > 1 ? 's' : ''} nuevo${sinContactar.length > 1 ? 's' : ''} sin primera respuesta`, href: '/leads' })

  // ProJump: compradores sin email registrado
  const projumpSinEmail = leads.filter(l => l.alpha_project === 'ProJump' && l.is_client && !l.email)
  if (projumpSinEmail.length > 0) tips.push({ level: 'info', text: `${projumpSinEmail.length} comprador${projumpSinEmail.length > 1 ? 'es' : ''} de ProJump sin email — no van a recibir campañas`, href: '/projump' })

  // ProJump: ventas este mes
  const projumpThisMonth = leads.filter(l => l.alpha_project === 'ProJump' && l.is_client && l.first_contact_date?.startsWith(thisMonth))
  if (projumpThisMonth.length > 0) tips.push({ level: 'info', text: `${projumpThisMonth.length} venta${projumpThisMonth.length > 1 ? 's' : ''} nueva${projumpThisMonth.length > 1 ? 's' : ''} de ProJump este mes — buen momento para una campaña de contenido`, href: '/projump' })

  // Sin leads nuevos este mes
  const newThisMonth = leads.filter(l => l.first_contact_date?.startsWith(thisMonth))
  if (newThisMonth.length === 0 && leads.length > 0) tips.push({ level: 'info', text: 'No entraron leads este mes — chequeá si las páginas web están activas', href: '/leads' })

  // Todo en orden
  if (tips.length === 0) tips.push({ level: 'info', text: 'Todo al día — buen momento para prospectar nuevos clientes o armar una campaña de email' })

  return tips.slice(0, 7)
}

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
  const thisMonth = today.slice(0, 7)

  const activeLeads = leads.filter(l => l.commercial_status !== 'Perdido' && l.commercial_status !== 'Pausado' && !l.is_client)
  const hotLeads = leads.filter(l => l.temperature === 'Caliente' && !l.is_client)
  const sentProposals = proposals.filter(p => p.status === 'Enviada' || p.status === 'Vista')
  const pendingFollowups = leads.filter(l => l.follow_up_date && l.follow_up_date <= today && l.commercial_status !== 'Perdido')
  const activeClients = leads.filter(l => l.is_client)
  const overdueTasks = tasks.filter(t => t.status === 'Vencido' || (t.due_date && isOverdue(t.due_date) && t.status !== 'Hecho'))
  const todayTasks = tasks.filter(t => t.due_date === today && t.status !== 'Hecho')
  const pipelineValue = leads.filter(l => !l.is_client).reduce((sum, l) => sum + (l.estimated_value ?? 0), 0)

  // ProJump metrics
  const projumpBuyers = leads.filter(l => l.alpha_project === 'ProJump' && l.is_client)
  const projumpTotal = projumpBuyers.reduce((sum, l) => sum + (l.estimated_value ?? 22500), 0)
  const projumpThisMonth = projumpBuyers.filter(l => l.first_contact_date?.startsWith(thisMonth))
  const projumpMonthRevenue = projumpThisMonth.reduce((sum, l) => sum + (l.estimated_value ?? 22500), 0)

  const tips = buildTips(leads, tasks, proposals, today)
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
        {/* ProJump — card doble */}
        <div className="col-span-2 lg:col-span-1 bg-[#111111] border border-[#242424] rounded-xl p-4 flex gap-4" style={{ borderColor: '#2d1a4a' }}>
          <div className="flex-1 min-w-0 space-y-1 border-r border-[#2d1a4a] pr-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#71717a] uppercase tracking-wider">ProJump este mes</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#C084FC]" />
            </div>
            <p className="text-lg font-bold text-white">${projumpMonthRevenue.toLocaleString('es-AR')}</p>
            <p className="text-xs text-[#71717a]">{projumpThisMonth.length} venta{projumpThisMonth.length !== 1 ? 's' : ''} nueva{projumpThisMonth.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#71717a] uppercase tracking-wider">ProJump total</span>
              <ShoppingBag className="w-3.5 h-3.5 text-[#C084FC]" />
            </div>
            <p className="text-lg font-bold text-white">${projumpTotal.toLocaleString('es-AR')}</p>
            <p className="text-xs text-[#71717a]">{projumpBuyers.length} comprador{projumpBuyers.length !== 1 ? 'es' : ''} ARS</p>
          </div>
        </div>
      </div>

      {!isEmpty && (
        <>
          {/* Main panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
            {/* Recomendaciones */}
            <div className="lg:col-span-2 bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
              <div className="px-4 md:px-5 py-4 border-b border-[#1a1a1a]">
                <h2 className="text-sm font-semibold text-white">Qué revisar hoy</h2>
                <p className="text-xs text-[#71717a] mt-0.5">Recomendaciones basadas en tu operación actual</p>
              </div>
              <div className="divide-y divide-[#1a1a1a]">
                {tips.map((tip, i) => {
                  const Icon = tip.level === 'urgent' ? AlertCircle : tip.level === 'warning' ? AlertTriangle : CheckCircle2
                  const color = tip.level === 'urgent' ? 'text-red-400' : tip.level === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                  const bg = tip.level === 'urgent' ? 'bg-red-500/5' : tip.level === 'warning' ? 'bg-amber-500/5' : ''
                  const row = (
                    <div key={i} className={`px-4 md:px-5 py-3.5 flex items-center gap-3 ${bg} ${tip.href ? 'hover:bg-white/[0.03] transition-colors' : ''}`}>
                      <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                      <span className="text-sm text-[#a1a1aa] flex-1">{tip.text}</span>
                      {tip.href && <ChevronRight className="w-3.5 h-3.5 text-[#3f3f46] shrink-0" />}
                    </div>
                  )
                  return tip.href ? <Link key={i} href={tip.href}>{row}</Link> : row
                })}
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
