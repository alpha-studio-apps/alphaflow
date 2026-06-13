'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Mail, Phone, AtSign, Globe, Edit2, Plus, Copy, CheckCheck,
  Clock, MessageSquare, FileText, Calendar, User, ChevronDown
} from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'
import ProjectBadge from '@/components/ui/ProjectBadge'
import TemperatureBadge from '@/components/ui/TemperatureBadge'
import PriorityBadge from '@/components/ui/PriorityBadge'
import CreateTaskModal from '@/components/modals/CreateTaskModal'
import { mockLeads, mockTasks, mockEmailTemplates, mockHistory, mockProposals } from '@/lib/mock-data'
import { formatDate, formatCurrency, getInitials, replaceTemplateVars } from '@/lib/utils'
import { cn } from '@/lib/utils'

type Tab = 'overview' | 'history' | 'emails' | 'proposals'

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>()
  const lead = mockLeads.find(l => l.id === id)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-[#71717a]">Lead no encontrado.</p>
        <Link href="/leads" className="mt-4 text-sm text-[#3B82F6] hover:underline">Volver a leads</Link>
      </div>
    )
  }

  const leadTasks = mockTasks.filter(t => t.lead_id === id)
  const leadHistory = mockHistory.filter(h => h.lead_id === id)
  const leadProposals = mockProposals.filter(p => p.lead_id === id)

  // Suggested emails: match by project, with fallback to all
  const suggestedEmails = mockEmailTemplates.filter(t => t.alpha_project === lead.alpha_project)

  const templateVars: Record<string, string> = {
    Nombre: lead.first_name,
    Marca: lead.company ?? lead.first_name,
    Servicio: lead.service_interested ?? '',
    ProyectoAlpha: lead.alpha_project,
  }

  async function copyEmail(template: typeof mockEmailTemplates[0]) {
    const text = `Asunto: ${template.subject}\n\n${replaceTemplateVars(template.body, templateVars)}`
    await navigator.clipboard.writeText(text)
    setCopiedId(template.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Resumen' },
    { key: 'history', label: `Historial${leadHistory.length ? ` (${leadHistory.length})` : ''}` },
    { key: 'emails', label: `Mails sugeridos${suggestedEmails.length ? ` (${suggestedEmails.length})` : ''}` },
    { key: 'proposals', label: `Propuestas${leadProposals.length ? ` (${leadProposals.length})` : ''}` },
  ]

  return (
    <>
      <div className="max-w-[1100px] mx-auto space-y-6">
        {/* Back */}
        <Link href="/leads" className="inline-flex items-center gap-1.5 text-sm text-[#71717a] hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver a leads
        </Link>

        {/* Header card */}
        <div className="bg-[#111111] border border-[#242424] rounded-xl p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-lg font-semibold text-[#a1a1aa] shrink-0">
                {getInitials(lead.first_name, lead.last_name)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{lead.first_name} {lead.last_name}</h1>
                {lead.company && <p className="text-sm text-[#71717a] mt-0.5">{lead.company}</p>}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <ProjectBadge project={lead.alpha_project} />
                  <StatusBadge status={lead.commercial_status} />
                  <TemperatureBadge temperature={lead.temperature} />
                  {lead.estimated_value && (
                    <span className="text-xs bg-white/[0.05] border border-[#2a2a2a] rounded-full px-2.5 py-1 text-[#a1a1aa]">
                      {formatCurrency(lead.estimated_value, lead.currency)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => setShowTaskModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-[#a1a1aa] border border-[#242424] bg-transparent hover:bg-white/[0.03] hover:text-white transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Crear tarea
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-all font-medium"
                onClick={() => setActiveTab('emails')}
              >
                <Mail className="w-3.5 h-3.5" /> Mail sugerido
              </button>
            </div>
          </div>

          {/* Quick info strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-[#1a1a1a]">
            <InfoItem icon={Clock} label="Primer contacto" value={formatDate(lead.first_contact_date)} />
            <InfoItem icon={Clock} label="Último contacto" value={formatDate(lead.last_contact_date)} />
            <InfoItem icon={Calendar} label="Próximo seguimiento" value={formatDate(lead.follow_up_date)} highlight={!!lead.follow_up_date} />
            <InfoItem icon={User} label="Canal" value={lead.entry_channel} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#0d0d0d] border border-[#242424] rounded-xl p-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-1 py-2 px-3 rounded-lg text-sm transition-all',
                activeTab === tab.key
                  ? 'bg-[#1a1a1a] text-white font-medium'
                  : 'text-[#71717a] hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: datos + diagnóstico */}
            <div className="lg:col-span-2 space-y-5">
              {/* Datos de contacto */}
              <Section title="Datos de contacto">
                <div className="grid grid-cols-2 gap-3">
                  {lead.email && <ContactItem icon={Mail} value={lead.email} />}
                  {lead.phone && <ContactItem icon={Phone} value={lead.phone} />}
                  {lead.instagram && <ContactItem icon={AtSign} value={lead.instagram} />}
                  {lead.website && <ContactItem icon={Globe} value={lead.website} />}
                </div>
              </Section>

              {/* Próximo paso */}
              {lead.next_step && (
                <Section title="Próximo paso">
                  <p className="text-sm text-white bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-4">{lead.next_step}</p>
                </Section>
              )}

              {/* Notas rápidas */}
              {lead.quick_notes && (
                <Section title="Notas internas">
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">{lead.quick_notes}</p>
                </Section>
              )}

              {/* Tareas */}
              <Section title={`Tareas (${leadTasks.length})`} action={<button onClick={() => setShowTaskModal(true)} className="text-xs text-[#3B82F6] hover:underline">+ Nueva</button>}>
                {leadTasks.length === 0 ? (
                  <p className="text-xs text-[#71717a] py-4 text-center">No hay tareas para este lead.</p>
                ) : (
                  <div className="space-y-2">
                    {leadTasks.map(task => (
                      <div key={task.id} className="flex items-center gap-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white">{task.title}</p>
                          {task.due_date && <p className="text-xs text-[#71717a] mt-0.5">Vence: {formatDate(task.due_date, { day: '2-digit', month: 'short' })}</p>}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <PriorityBadge priority={task.priority} size="sm" />
                          <span className={cn('text-xs px-2 py-0.5 rounded-full',
                            task.status === 'Hecho' ? 'bg-emerald-500/10 text-emerald-400' :
                            task.status === 'Vencido' ? 'bg-red-500/10 text-red-400' :
                            'bg-zinc-500/10 text-zinc-400'
                          )}>{task.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            </div>

            {/* Right sidebar */}
            <div className="space-y-5">
              {/* Estado comercial */}
              <Section title="Estado comercial">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#71717a]">Estado</span>
                    <StatusBadge status={lead.commercial_status} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#71717a]">Temperatura</span>
                    <TemperatureBadge temperature={lead.temperature} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#71717a]">Prioridad</span>
                    <PriorityBadge priority={lead.priority} size="sm" />
                  </div>
                  {lead.service_interested && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#71717a]">Servicio</span>
                      <span className="text-xs text-[#a1a1aa]">{lead.service_interested}</span>
                    </div>
                  )}
                  {lead.estimated_value && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#71717a]">Valor estimado</span>
                      <span className="text-xs text-white font-medium">{formatCurrency(lead.estimated_value, lead.currency)}</span>
                    </div>
                  )}
                </div>
              </Section>

              {/* Quick email */}
              {suggestedEmails[0] && (
                <Section title="Mail rápido recomendado">
                  <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-3">
                    <p className="text-xs text-[#a1a1aa] font-medium mb-1">{suggestedEmails[0].title}</p>
                    <p className="text-xs text-[#71717a] mb-3 line-clamp-3">{suggestedEmails[0].body.slice(0, 120)}...</p>
                    <button
                      onClick={() => copyEmail(suggestedEmails[0])}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-md text-xs bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 hover:bg-[#3B82F6]/15 transition-all"
                    >
                      {copiedId === suggestedEmails[0].id ? <><CheckCheck className="w-3 h-3" /> Copiado</> : <><Copy className="w-3 h-3" /> Copiar mail</>}
                    </button>
                  </div>
                </Section>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <Section title="Historial de contacto">
            {leadHistory.length === 0 ? (
              <p className="text-sm text-[#71717a] text-center py-8">Este lead todavía no tiene historial.</p>
            ) : (
              <div className="relative pl-5">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-[#1a1a1a]" />
                <div className="space-y-6">
                  {leadHistory.map(h => (
                    <div key={h.id} className="relative">
                      <div className="absolute -left-3 top-1 w-2 h-2 rounded-full bg-[#2a2a2a] border border-[#3f3f46]" />
                      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-[#a1a1aa] bg-[#1a1a1a] px-2 py-0.5 rounded-full">{h.interaction_type}</span>
                          <span className="text-xs text-[#71717a]">{formatDate(h.date)}</span>
                        </div>
                        <p className="text-sm text-white">{h.summary}</p>
                        {h.result && <p className="text-xs text-[#71717a] mt-2">Resultado: {h.result}</p>}
                        {h.next_action && <p className="text-xs text-[#3B82F6] mt-1">→ {h.next_action}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}

        {activeTab === 'emails' && (
          <div className="space-y-4">
            <p className="text-sm text-[#71717a]">Mails sugeridos para <span className="text-white">{lead.alpha_project}</span> · {lead.commercial_status}</p>
            {suggestedEmails.length === 0 ? (
              <Section title="">
                <p className="text-sm text-[#71717a] text-center py-8">No hay mails configurados para este proyecto.</p>
              </Section>
            ) : (
              suggestedEmails.map(template => (
                <div key={template.id} className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{template.title}</p>
                      <p className="text-xs text-[#71717a] mt-0.5">Etapa: {template.commercial_stage}</p>
                    </div>
                    <button
                      onClick={() => copyEmail(template)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 hover:bg-[#3B82F6]/15 transition-all whitespace-nowrap"
                    >
                      {copiedId === template.id
                        ? <><CheckCheck className="w-3.5 h-3.5" /> Copiado</>
                        : <><Copy className="w-3.5 h-3.5" /> Copiar mail</>
                      }
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-[#71717a] mb-1 font-medium uppercase tracking-wide">Asunto</p>
                    <p className="text-sm text-white mb-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg px-3 py-2">
                      {replaceTemplateVars(template.subject, templateVars)}
                    </p>
                    <p className="text-xs text-[#71717a] mb-1 font-medium uppercase tracking-wide">Cuerpo</p>
                    <pre className="text-sm text-[#a1a1aa] bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg px-4 py-3 whitespace-pre-wrap font-sans leading-relaxed">
                      {replaceTemplateVars(template.body, templateVars)}
                    </pre>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'proposals' && (
          <Section title="Propuestas">
            {leadProposals.length === 0 ? (
              <p className="text-sm text-[#71717a] text-center py-8">No hay propuestas para este lead.</p>
            ) : (
              <div className="space-y-3">
                {leadProposals.map(p => (
                  <div key={p.id} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-white">{p.title}</p>
                      {p.notes && <p className="text-xs text-[#71717a] mt-0.5">{p.notes}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-sm font-semibold text-white">{formatCurrency(p.amount, p.currency)}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full',
                        p.status === 'Aprobada' ? 'bg-emerald-500/10 text-emerald-400' :
                        p.status === 'Rechazada' ? 'bg-red-500/10 text-red-400' :
                        'bg-blue-500/10 text-blue-400'
                      )}>{p.status}</span>
                      {p.sent_date && <span className="text-xs text-[#71717a]">{formatDate(p.sent_date, { day: '2-digit', month: 'short' })}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}
      </div>

      <CreateTaskModal
        open={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        leadId={lead.id}
        leadName={`${lead.first_name} ${lead.last_name}`}
      />
    </>
  )
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
      {title && (
        <div className="px-5 py-3.5 border-b border-[#1a1a1a] flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">{title}</h3>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  )
}

function InfoItem({ icon: Icon, label, value, highlight }: { icon: any; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-[#3f3f46] shrink-0" />
      <div>
        <p className="text-[10px] text-[#71717a] uppercase tracking-wide">{label}</p>
        <p className={cn('text-xs font-medium', highlight ? 'text-[#3B82F6]' : 'text-[#a1a1aa]')}>{value}</p>
      </div>
    </div>
  )
}

function ContactItem({ icon: Icon, value }: { icon: any; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg px-3 py-2">
      <Icon className="w-3.5 h-3.5 text-[#3f3f46] shrink-0" />
      <span className="text-xs text-[#a1a1aa] truncate">{value}</span>
    </div>
  )
}
