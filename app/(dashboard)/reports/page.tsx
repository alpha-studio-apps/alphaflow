import { BarChart2 } from 'lucide-react'
import { mockLeads, mockProposals, mockTasks } from '@/lib/mock-data'
import { ALPHA_PROJECTS, COMMERCIAL_STATUSES, PROJECT_COLORS } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'

export default function ReportsPage() {
  const totalLeads = mockLeads.length
  const activeClients = mockLeads.filter(l => l.is_client).length
  const pipelineValue = mockLeads.filter(l => !l.is_client).reduce((s, l) => s + (l.estimated_value ?? 0), 0)
  const proposalsSent = mockProposals.filter(p => p.status !== 'Borrador').length
  const proposalsApproved = mockProposals.filter(p => p.status === 'Aprobada').length
  const conversionRate = totalLeads > 0 ? Math.round((activeClients / totalLeads) * 100) : 0

  // By project
  const byProject = ALPHA_PROJECTS.map(p => ({
    project: p,
    count: mockLeads.filter(l => l.alpha_project === p).length,
    value: mockLeads.filter(l => l.alpha_project === p).reduce((s, l) => s + (l.estimated_value ?? 0), 0),
  })).filter(p => p.count > 0)

  // By channel
  const channels: Record<string, number> = {}
  mockLeads.forEach(l => { channels[l.entry_channel] = (channels[l.entry_channel] ?? 0) + 1 })
  const byChannel = Object.entries(channels).sort((a, b) => b[1] - a[1])

  // By status
  const byStatus = COMMERCIAL_STATUSES.map(s => ({
    status: s,
    count: mockLeads.filter(l => l.commercial_status === s).length,
  })).filter(s => s.count > 0)

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Reportes</h1>
        <p className="text-sm text-[#71717a] mt-1">Vista general del rendimiento comercial</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total leads', value: totalLeads },
          { label: 'Clientes activos', value: activeClients },
          { label: 'Tasa de conversión', value: `${conversionRate}%` },
          { label: 'Pipeline estimado', value: formatCurrency(pipelineValue) },
          { label: 'Propuestas enviadas', value: proposalsSent },
          { label: 'Propuestas aprobadas', value: proposalsApproved },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#111111] border border-[#242424] rounded-xl p-5">
            <p className="text-xs text-[#71717a] uppercase tracking-wide mb-2">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* By project */}
        <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1a1a1a]">
            <h2 className="text-sm font-semibold text-white">Leads por proyecto Alpha</h2>
          </div>
          <div className="p-5 space-y-3">
            {byProject.map(({ project, count, value }) => {
              const pct = Math.round((count / totalLeads) * 100)
              const color = PROJECT_COLORS[project as keyof typeof PROJECT_COLORS]
              return (
                <div key={project}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-white font-medium">{project}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#71717a]">{formatCurrency(value)}</span>
                      <span className="text-xs text-[#a1a1aa] w-6 text-right">{count}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color?.accent ?? '#3B82F6' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* By status */}
        <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1a1a1a]">
            <h2 className="text-sm font-semibold text-white">Leads por estado comercial</h2>
          </div>
          <div className="p-5 space-y-2">
            {byStatus.map(({ status, count }) => (
              <div key={status} className="flex items-center justify-between py-1.5">
                <span className="text-xs text-[#a1a1aa]">{status}</span>
                <div className="flex items-center gap-3">
                  <div className="h-1 rounded-full bg-[#1a1a1a] w-24 overflow-hidden">
                    <div className="h-full bg-[#3B82F6]/40 rounded-full" style={{ width: `${(count / totalLeads) * 100}%` }} />
                  </div>
                  <span className="text-xs text-white font-medium w-4 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By channel */}
        <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1a1a1a]">
            <h2 className="text-sm font-semibold text-white">Leads por canal de entrada</h2>
          </div>
          <div className="p-5 space-y-2">
            {byChannel.map(([channel, count]) => (
              <div key={channel} className="flex items-center justify-between py-1.5">
                <span className="text-xs text-[#a1a1aa]">{channel}</span>
                <div className="flex items-center gap-3">
                  <div className="h-1 rounded-full bg-[#1a1a1a] w-24 overflow-hidden">
                    <div className="h-full bg-blue-400/40 rounded-full" style={{ width: `${(count / totalLeads) * 100}%` }} />
                  </div>
                  <span className="text-xs text-white font-medium w-4 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks summary */}
        <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1a1a1a]">
            <h2 className="text-sm font-semibold text-white">Estado de tareas</h2>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            {(['Pendiente', 'En proceso', 'Hecho', 'Vencido'] as const).map(s => {
              const count = mockTasks.filter(t => t.status === s).length
              return (
                <div key={s} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-3">
                  <p className="text-xs text-[#71717a]">{s}</p>
                  <p className="text-xl font-bold text-white mt-1">{count}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
