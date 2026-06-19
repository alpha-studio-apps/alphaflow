'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { ALPHA_PROJECTS, TASK_TYPES, PRIORITIES } from '@/lib/constants'
import { addTask } from '@/lib/store'
import { Task } from '@/types'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  leadId?: string
  leadName?: string
}

export default function CreateTaskModal({ open, onClose, leadId, leadName }: Props) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    alpha_project: 'NahuelContent',
    task_type: 'Seguimiento',
    status: 'Pendiente',
    priority: 'Media',
    due_date: '',
  })

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await addTask({
      title: form.title,
      description: form.description || undefined,
      alpha_project: form.alpha_project as Task['alpha_project'],
      task_type: form.task_type as Task['task_type'],
      status: form.status as Task['status'],
      priority: form.priority as Task['priority'],
      due_date: form.due_date || undefined,
      lead_id: leadId,
    })
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full sm:w-[460px] sm:max-w-[calc(100vw-2rem)] bg-[#0d0d0d] sm:border border-t sm:border-t border-[#242424] rounded-t-2xl sm:rounded-xl overflow-hidden">
        {/* Handle bar — mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#2a2a2a]" />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
          <div>
            <h2 className="text-sm font-semibold text-white">Nueva tarea</h2>
            {leadName && <p className="text-xs text-[#71717a] mt-0.5">Para: {leadName}</p>}
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717a] hover:text-white hover:bg-white/5 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <Field label="Título *">
            <input required value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="Ej: Hacer seguimiento de propuesta" className={inputClass} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Proyecto Alpha">
              <select value={form.alpha_project} onChange={e => set('alpha_project', e.target.value)} className={inputClass}>
                {ALPHA_PROJECTS.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Tipo">
              <select value={form.task_type} onChange={e => set('task_type', e.target.value)} className={inputClass}>
                {TASK_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Prioridad">
              <select value={form.priority} onChange={e => set('priority', e.target.value)} className={inputClass}>
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Fecha límite">
              <input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} className={inputClass} />
            </Field>
          </div>

          <Field label="Descripción">
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={2} placeholder="Detalle opcional..."
              className={cn(inputClass, 'resize-none')} />
          </Field>

          <div className="flex gap-2 pt-1 pb-safe">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-md text-sm text-[#a1a1aa] border border-[#242424] bg-transparent hover:bg-white/[0.03] transition-all">
              Cancelar
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-md text-sm text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-all font-medium">
              Crear tarea
            </button>
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
