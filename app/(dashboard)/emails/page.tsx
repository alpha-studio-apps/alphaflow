'use client'

import { useState } from 'react'
import { Copy, CheckCheck, Mail } from 'lucide-react'
import ProjectBadge from '@/components/ui/ProjectBadge'
import EmptyState from '@/components/ui/EmptyState'
import { mockEmailTemplates } from '@/lib/mock-data'
import { ALPHA_PROJECTS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { AlphaProject } from '@/types'

export default function EmailsPage() {
  const [filterProject, setFilterProject] = useState<AlphaProject | ''>('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = mockEmailTemplates.filter(t => !filterProject || t.alpha_project === filterProject)

  async function copyEmail(id: string, subject: string, body: string) {
    await navigator.clipboard.writeText(`Asunto: ${subject}\n\n${body}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Biblioteca de mails</h1>
        <p className="text-sm text-[#71717a] mt-1">Plantillas listas para copiar y enviar</p>
      </div>

      {/* Project filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterProject('')}
          className={cn('px-3 py-1.5 rounded-md text-xs transition-all border',
            !filterProject ? 'border-[#3f3f46] text-white bg-white/5' : 'border-[#242424] text-[#71717a] hover:text-white hover:border-[#3f3f46]'
          )}>
          Todos
        </button>
        {ALPHA_PROJECTS.map(p => (
          <button key={p} onClick={() => setFilterProject(p === filterProject ? '' : p)}
            className={cn('px-3 py-1.5 rounded-md text-xs transition-all border',
              filterProject === p ? 'border-[#3f3f46] text-white bg-white/5' : 'border-[#242424] text-[#71717a] hover:text-white hover:border-[#3f3f46]'
            )}>
            {p}
          </button>
        ))}
      </div>

      {/* Templates */}
      {filtered.length === 0 ? (
        <div className="bg-[#111111] border border-[#242424] rounded-xl">
          <EmptyState icon={Mail} title="Sin plantillas" description="No hay plantillas para este filtro." />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(template => {
            const expanded = expandedId === template.id
            return (
              <div key={template.id} className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
                <div
                  className="px-5 py-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpandedId(expanded ? null : template.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div>
                      <p className="text-sm font-medium text-white">{template.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <ProjectBadge project={template.alpha_project} size="sm" />
                        <span className="text-xs text-[#71717a]">{template.commercial_stage}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={e => { e.stopPropagation(); copyEmail(template.id, template.subject, template.body) }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 hover:bg-[#3B82F6]/15 transition-all"
                    >
                      {copiedId === template.id ? <><CheckCheck className="w-3 h-3" /> Copiado</> : <><Copy className="w-3 h-3" /> Copiar</>}
                    </button>
                    <span className="text-[#3f3f46] text-sm">{expanded ? '↑' : '↓'}</span>
                  </div>
                </div>

                {expanded && (
                  <div className="border-t border-[#1a1a1a] p-5 space-y-4">
                    <div>
                      <p className="text-xs text-[#71717a] uppercase tracking-wide font-medium mb-1.5">Asunto</p>
                      <p className="text-sm text-white bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg px-3 py-2">{template.subject}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#71717a] uppercase tracking-wide font-medium mb-1.5">Cuerpo del mail</p>
                      <pre className="text-sm text-[#a1a1aa] bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg px-4 py-3 whitespace-pre-wrap font-sans leading-relaxed">{template.body}</pre>
                    </div>
                    <p className="text-xs text-[#3f3f46]">Variables: [Nombre], [Marca], [Servicio] se reemplazan automáticamente al usar desde la ficha de un lead.</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
