'use client'

import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getLeads, loadLeads, getTasks, loadTasks, onLeadsChange, onTasksChange } from '@/lib/store'
import { ALPHA_PROJECTS, PROJECT_COLORS, COMMERCIAL_STATUSES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { Lead, Task } from '@/types'
import StatusBadge from '@/components/ui/StatusBadge'
import ProjectBadge from '@/components/ui/ProjectBadge'

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function getMonthRange(year: number, month: number) {
  const start = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const end = new Date(year, month + 1, 0)
  const endStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`
  return { start, end: endStr }
}

function inMonth(dateStr: string | undefined | null, year: number, month: number): boolean {
  if (!dateStr) return false
  return dateStr.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)
}

export default function ReportsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  useEffect(() => {
    loadLeads()
    loadTasks()
    const u1 = onLeadsChange(() => setLeads(getLeads()))
    const u2 = onTasksChange(() => setTasks(getTasks()))
    return () => { u1(); u2() }
  }, [])

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    const n = new Date(); if (year > n.getFullYear() || (year === n.getFullYear() && month >= n.getMonth())) return
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()

  // Leads del mes seleccionado (creados ese mes)
  const monthLeads = useMemo(() => leads.filter(l => inMonth(l.created_at, year, month)), [leads, year, month])

  // Leads del mes anterior (para comparar)
  const prevM = month === 0 ? 11 : month - 1
  const prevY = month === 0 ? year - 1 : year
  const prevMonthLeads = useMemo(() => leads.filter(l => inMonth(l.created_at, prevY, prevM)), [leads, prevY, prevM])

  // Métricas del mes
  const newLeads = monthLeads.length
  const newClients = monthLeads.filter(l => l.is_client || l.commercial_status === 'Cliente activo').length
  const lostLeads = monthLeads.filter(l => l.commercial_status === 'Perdido').length
  const pipelineAdded = monthLeads.reduce((s, l) => s + (l.estimated_value ?? 0), 0)
  const valueWon = monthLeads.filter(l => l.is_client || l.commercial_status === 'Cliente activo').reduce((s, l) => s + (l.estimated_value ?? 0), 0)
  const conversionRate = newLeads > 0 ? Math.round((newClients / newLeads) * 100) : 0

  // Comparación con mes anterior
  const prevNew = prevMonthLeads.length
  const prevClients = prevMonthLeads.filter(l => l.is_client || l.commercial_status === 'Cliente activo').length

  // Tareas del mes
  const monthTasks = useMemo(() => tasks.filter(t => inMonth(t.created_at, year, month)), [tasks, year, month])
  const doneTasks = monthTasks.filter(t => t.status === 'Hecho').length

  // Totales acumulados (todos los tiempos)
  const totalLeads = leads.length
  const totalClients = leads.filter(l => l.is_client || l.commercial_status === 'Cliente activo').length
  const totalPipeline = leads.filter(l => !l.is_client && l.commercial_status !== 'Perdido').reduce((s, l) => s + (l.estimated_value ?? 0), 0)
  const totalConversion = totalLeads > 0 ? Math.round((totalClients / totalLeads) * 100) : 0

  // Por proyecto (mes)
  const byProject = ALPHA_PROJECTS.map(p => ({
    project: p,
    count: monthLeads.filter(l => l.alpha_project === p).length,
    value: monthLeads.filter(l => l.alpha_project === p).reduce((s, l) => s + (l.estimated_value ?? 0), 0),
  })).filter(p => p.count > 0)

  // Por estado (mes)
  const byStatus = COMMERCIAL_STATUSES.map(s => ({
    status: s,
    count: monthLeads.filter(l => l.commercial_status === s).length,
  })).filter(s => s.count > 0)

  // Historial de meses con leads
  const monthsWithData = useMemo(() => {
    const keys = new Set<string>()
    leads.forEach(l => { if (l.created_at) keys.add(l.created_at.slice(0, 7)) })
    return Array.from(keys).sort().reverse()
  }, [leads])

  function delta(current: number, prev: number) {
    if (prev === 0) return null
    const d = current - prev
    return { d, pct: Math.round((d / prev) * 100), positive: d >= 0 }
  }

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Reportes</h1>
          <p className="text-sm text-[#71717a] mt-1">Rendimiento comercial mes a mes</p>
        </div>
        {/* Totales globales */}
        <div className="flex items-center gap-4 text-right">
          <div>
            <p className="text-xs text-[#71717a]">Total leads</p>
            <p className="text-lg font-bold text-white">{totalLeads}</p>
          </div>
          <div>
            <p className="text-xs text-[#71717a]">Clientes</p>
            <p className="text-lg font-bold text-white">{totalClients}</p>
          </div>
          <div>
            <p className="text-xs text-[#71717a]">Pipeline activo</p>
            <p className="text-lg font-bold text-white">{formatCurrency(totalPipeline)}</p>
          </div>
        </div>
      </div>

      {/* Navegador de mes */}
      <div className="bg-[#111111] border border-[#242424] rounded-xl px-5 py-4 flex items-center justify-between">
        <button onClick={prevMonth} className="w-8 h-8 rounded-md flex items-center justify-center text-[#71717a] hover:text-white hover:bg-white/5 transition-all">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <p className="text-base font-semibold text-white">{MONTHS[month]} {year}</p>
          {isCurrentMonth && <p className="text-xs text-[#3B82F6] mt-0.5">Mes en curso</p>}
        </div>
        <button onClick={nextMonth} disabled={isCurrentMonth}
          className="w-8 h-8 rounded-md flex items-center justify-center text-[#71717a] hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Métricas del mes */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'Leads nuevos', value: newLeads, d: delta(newLeads, prevNew) },
          { label: 'Clientes cerrados', value: newClients, d: delta(newClients, prevClients) },
          { label: 'Tasa de conversión', value: `${conversionRate}%`, d: null },
          { label: 'Valor ganado', value: formatCurrency(valueWon), d: null },
          { label: 'Pipeline sumado', value: formatCurrency(pipelineAdded), d: null },
          { label: 'Tareas completadas', value: doneTasks, d: null },
        ].map(({ label, value, d }) => (
          <div key={label} className="bg-[#111111] border border-[#242424] rounded-xl p-4">
            <p className="text-xs text-[#71717a] uppercase tracking-wide mb-2">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
            {d && (
              <p className={`text-xs mt-1 ${d.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                {d.positive ? '+' : ''}{d.d} vs mes anterior
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Leads del mes */}
        <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1a1a1a]">
            <h2 className="text-sm font-semibold text-white">Leads ingresados en {MONTHS[month]}</h2>
            <p className="text-xs text-[#71717a] mt-0.5">{newLeads} leads</p>
          </div>
          <div className="divide-y divide-[#1a1a1a]">
            {monthLeads.length === 0 ? (
              <p className="text-sm text-[#71717a] text-center py-8">Sin leads este mes</p>
            ) : (
              monthLeads.slice(0, 8).map(lead => (
                <Link key={lead.id} href={`/leads/${lead.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium">{lead.first_name} {lead.last_name}</p>
                    {lead.company && <p className="text-xs text-[#71717a] truncate">{lead.company}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <StatusBadge status={lead.commercial_status} size="sm" />
                    {lead.estimated_value && <span className="text-xs text-[#71717a] hidden sm:block">{formatCurrency(lead.estimated_value)}</span>}
                  </div>
                </Link>
              ))
            )}
            {monthLeads.length > 8 && (
              <p className="text-xs text-[#71717a] text-center py-3">+{monthLeads.length - 8} más</p>
            )}
          </div>
        </div>

        {/* Por proyecto */}
        <div className="space-y-4">
          <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1a1a1a]">
              <h2 className="text-sm font-semibold text-white">Por proyecto Alpha</h2>
            </div>
            <div className="p-5 space-y-3">
              {byProject.length === 0 ? (
                <p className="text-sm text-[#71717a] text-center py-4">Sin datos</p>
              ) : byProject.map(({ project, count, value }) => {
                const pct = newLeads > 0 ? Math.round((count / newLeads) * 100) : 0
                const color = PROJECT_COLORS[project as keyof typeof PROJECT_COLORS]
                return (
                  <div key={project}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-white font-medium">{project}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#71717a]">{formatCurrency(value)}</span>
                        <span className="text-xs text-[#a1a1aa] w-4 text-right">{count}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color?.accent ?? '#3B82F6' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Por estado */}
          <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1a1a1a]">
              <h2 className="text-sm font-semibold text-white">Por estado comercial</h2>
            </div>
            <div className="p-4 space-y-1.5">
              {byStatus.length === 0 ? (
                <p className="text-sm text-[#71717a] text-center py-4">Sin datos</p>
              ) : byStatus.map(({ status, count }) => (
                <div key={status} className="flex items-center justify-between py-1">
                  <StatusBadge status={status} size="sm" />
                  <span className="text-xs text-white font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Historial de meses */}
      {monthsWithData.length > 1 && (
        <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1a1a1a]">
            <h2 className="text-sm font-semibold text-white">Historial por mes</h2>
            <p className="text-xs text-[#71717a] mt-0.5">Leads ingresados cada mes</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  {['Mes', 'Leads', 'Clientes', 'Perdidos', 'Pipeline', 'Conversión'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] text-[#71717a] font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {monthsWithData.map(key => {
                  const [y, m] = key.split('-').map(Number)
                  const mLeads = leads.filter(l => l.created_at?.startsWith(key))
                  const mClients = mLeads.filter(l => l.is_client || l.commercial_status === 'Cliente activo').length
                  const mLost = mLeads.filter(l => l.commercial_status === 'Perdido').length
                  const mPipeline = mLeads.reduce((s, l) => s + (l.estimated_value ?? 0), 0)
                  const mConv = mLeads.length > 0 ? Math.round((mClients / mLeads.length) * 100) : 0
                  const isSelected = y === year && m - 1 === month
                  return (
                    <tr key={key}
                      onClick={() => { setYear(y); setMonth(m - 1) }}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-[#3B82F6]/10' : 'hover:bg-white/[0.02]'}`}>
                      <td className="px-4 py-3 text-sm text-white font-medium whitespace-nowrap">
                        {MONTHS[m - 1]} {y}
                        {isSelected && <span className="ml-2 text-[10px] text-[#3B82F6]">← seleccionado</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-white">{mLeads.length}</td>
                      <td className="px-4 py-3 text-sm text-emerald-400">{mClients}</td>
                      <td className="px-4 py-3 text-sm text-red-400">{mLost}</td>
                      <td className="px-4 py-3 text-sm text-[#a1a1aa] whitespace-nowrap">{formatCurrency(mPipeline)}</td>
                      <td className="px-4 py-3 text-sm text-[#a1a1aa]">{mConv}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
