import Link from 'next/link'
import { FileText } from 'lucide-react'
import ProjectBadge from '@/components/ui/ProjectBadge'
import EmptyState from '@/components/ui/EmptyState'
import { mockProposals } from '@/lib/mock-data'
import { PROPOSAL_STATUS_COLORS } from '@/lib/constants'
import { formatDate, formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function ProposalsPage() {
  return (
    <div className="max-w-[1000px] mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Propuestas</h1>
        <p className="text-sm text-[#71717a] mt-1">{mockProposals.length} propuesta{mockProposals.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
        {mockProposals.length === 0 ? (
          <EmptyState icon={FileText} title="Sin propuestas" description="Creá tu primera propuesta desde la ficha de un lead." />
        ) : (
          <div className="divide-y divide-[#1a1a1a]">
            {mockProposals.map(p => {
              const colors = PROPOSAL_STATUS_COLORS[p.status]
              return (
                <div key={p.id} className="px-5 py-4 flex items-center gap-5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{p.title}</p>
                    {p.lead && (
                      <Link href={`/leads/${p.lead_id}`} className="text-xs text-[#71717a] hover:text-white transition-colors mt-0.5 block">
                        {p.lead.first_name} {p.lead.last_name}
                        {p.lead.company && ` · ${p.lead.company}`}
                      </Link>
                    )}
                    {p.notes && <p className="text-xs text-[#3f3f46] mt-1">{p.notes}</p>}
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    {p.lead && <ProjectBadge project={p.lead.alpha_project} size="sm" />}
                    <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', colors.bg, colors.text)}>{p.status}</span>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{formatCurrency(p.amount, p.currency)}</p>
                      {p.sent_date && <p className="text-xs text-[#71717a]">{formatDate(p.sent_date, { day: '2-digit', month: 'short' })}</p>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
