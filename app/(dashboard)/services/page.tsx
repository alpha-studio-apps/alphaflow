import { Briefcase } from 'lucide-react'
import ProjectBadge from '@/components/ui/ProjectBadge'
import { mockServices } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'

export default function ServicesPage() {
  return (
    <div className="max-w-[1100px] mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Servicios</h1>
        <p className="text-sm text-[#71717a] mt-1">Catálogo de servicios del ecosistema Alpha</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockServices.map(service => (
          <div key={service.id} className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1a1a1a] flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">{service.name}</h3>
                <div className="mt-1.5">
                  <ProjectBadge project={service.alpha_project} size="sm" />
                </div>
              </div>
              {service.base_price && (
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-white">{formatCurrency(service.base_price, service.currency)}</p>
                  <p className="text-xs text-[#71717a]">{service.duration}</p>
                </div>
              )}
            </div>
            <div className="p-5 space-y-3">
              {service.description && (
                <p className="text-sm text-[#a1a1aa] leading-relaxed">{service.description}</p>
              )}
              {service.ideal_client && (
                <div>
                  <p className="text-xs text-[#71717a] font-medium uppercase tracking-wide mb-1">Cliente ideal</p>
                  <p className="text-xs text-[#a1a1aa]">{service.ideal_client}</p>
                </div>
              )}
              {service.problem_solved && (
                <div>
                  <p className="text-xs text-[#71717a] font-medium uppercase tracking-wide mb-1">Problema que resuelve</p>
                  <p className="text-xs text-[#a1a1aa]">{service.problem_solved}</p>
                </div>
              )}
              {service.deliverables && (
                <div>
                  <p className="text-xs text-[#71717a] font-medium uppercase tracking-wide mb-1">Entregables</p>
                  <p className="text-xs text-[#a1a1aa]">{service.deliverables}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
