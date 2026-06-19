'use client'

import { useState, useEffect } from 'react'
import { Copy, CheckCheck, Mail, Plus, Trash2, X } from 'lucide-react'
import ProjectBadge from '@/components/ui/ProjectBadge'
import EmptyState from '@/components/ui/EmptyState'
import { getEmailTemplates, loadEmailTemplates, addEmailTemplate, deleteEmailTemplate, onEmailTemplatesChange } from '@/lib/store'
import { ALPHA_PROJECTS, TEMPERATURES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { AlphaProject, EmailTemplate } from '@/types'

export default function EmailsPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(() => getEmailTemplates())
  const [filterProject, setFilterProject] = useState<AlphaProject | ''>('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadEmailTemplates()
    return onEmailTemplatesChange(() => setTemplates(getEmailTemplates()))
  }, [])

  const filtered = templates.filter(t => !filterProject || t.alpha_project === filterProject)

  async function copyEmail(id: string, subject: string, body: string) {
    await navigator.clipboard.writeText(`Asunto: ${subject}\n\n${body}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    if (confirmDelete === id) {
      deleteEmailTemplate(id)
      setConfirmDelete(null)
      if (expandedId === id) setExpandedId(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Biblioteca de mails</h1>
          <p className="text-sm text-[#71717a] mt-1">Plantillas listas para copiar y enviar</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-all font-medium shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Nueva plantilla</span>
          <span className="sm:hidden">Nueva</span>
        </button>
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
      {templates.length === 0 ? (
        <div className="bg-[#111111] border border-[#242424] rounded-xl">
          <EmptyState icon={Mail} title="Sin plantillas cargadas" description="Creá tu primera plantilla de mail para tenerla lista cuando la necesites." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111111] border border-[#242424] rounded-xl">
          <EmptyState icon={Mail} title="Sin resultados" description="No hay plantillas para este proyecto." />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(template => {
            const expanded = expandedId === template.id
            return (
              <div key={template.id} className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden group">
                <div
                  className="px-5 py-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpandedId(expanded ? null : template.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{template.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
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
                    <button
                      onClick={e => handleDelete(e, template.id)}
                      title={confirmDelete === template.id ? 'Hacé click de nuevo para confirmar' : 'Eliminar plantilla'}
                      className={cn(
                        'w-7 h-7 rounded-md flex items-center justify-center transition-all',
                        confirmDelete === template.id
                          ? 'bg-red-500/20 text-red-400'
                          : 'text-[#3f3f46] hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100'
                      )}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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

      {confirmDelete && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-red-500/30 rounded-xl px-5 py-3 text-sm text-red-400 shadow-xl z-50">
          Hacé click de nuevo en el ícono para confirmar la eliminación
        </div>
      )}

      {showModal && <CreateTemplateModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

function CreateTemplateModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    title: '',
    alpha_project: 'NahuelContent',
    commercial_stage: 'Respuesta cuando pide más información',
    recommended_temperature: 'Tibio',
    subject: '',
    body: '',
  })

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await addEmailTemplate({
      alpha_project: form.alpha_project as EmailTemplate['alpha_project'],
      title: form.title,
      commercial_stage: form.commercial_stage,
      recommended_temperature: form.recommended_temperature as EmailTemplate['recommended_temperature'],
      subject: form.subject,
      body: form.body,
      active: true,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:w-[600px] sm:max-w-[calc(100vw-2rem)] max-h-[92dvh] bg-[#0d0d0d] sm:border border-t sm:border-t border-[#242424] rounded-t-2xl sm:rounded-xl overflow-y-auto">
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#2a2a2a]" />
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a] sticky top-0 bg-[#0d0d0d] z-10">
          <h2 className="text-sm font-semibold text-white">Nueva plantilla de mail</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717a] hover:text-white hover:bg-white/5 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <Field label="Título interno *">
            <input required value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ej: NahuelContent — Respuesta inicial" className={inputClass} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Proyecto Alpha">
              <select value={form.alpha_project} onChange={e => set('alpha_project', e.target.value)} className={inputClass}>
                {ALPHA_PROJECTS.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Temperatura recomendada">
              <select value={form.recommended_temperature} onChange={e => set('recommended_temperature', e.target.value)} className={inputClass}>
                {TEMPERATURES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Etapa comercial">
            <input value={form.commercial_stage} onChange={e => set('commercial_stage', e.target.value)} placeholder="Ej: Respuesta cuando pide más información" className={inputClass} />
          </Field>
          <Field label="Asunto del mail *">
            <input required value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Sobre cómo trabajo..." className={inputClass} />
          </Field>
          <Field label="Cuerpo del mail *">
            <textarea required value={form.body} onChange={e => set('body', e.target.value)} rows={8}
              placeholder="Hola [Nombre], &#10;&#10;..." className={cn(inputClass, 'resize-none font-mono text-xs leading-relaxed')} />
          </Field>
          <p className="text-xs text-[#3f3f46] -mt-2">Usá [Nombre], [Marca] y [Servicio] como variables que se reemplazan automáticamente.</p>
          <div className="flex gap-2 pt-1 pb-safe">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-md text-sm text-[#a1a1aa] border border-[#242424] hover:bg-white/[0.03] transition-all">Cancelar</button>
            <button type="submit" className="flex-1 py-2.5 rounded-md text-sm text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-all font-medium">Guardar plantilla</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const inputClass = 'w-full bg-[#111111] border border-[#242424] rounded-md px-3 py-2.5 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-[#3f3f46] transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-[#71717a] font-medium">{label}</label>
      {children}
    </div>
  )
}
