'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { ALPHA_PROJECTS, COMMERCIAL_STATUSES, TEMPERATURES, ENTRY_CHANNELS, PRIORITIES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CreateLeadModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    company: '',
    email: '',
    phone: '',
    instagram: '',
    alpha_project: 'NahuelContent',
    service_interested: '',
    commercial_status: 'Nuevo lead',
    temperature: 'Frío',
    entry_channel: 'Instagram',
    priority: 'Media',
    estimated_value: '',
    quick_notes: '',
    follow_up_date: '',
  })

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: save to Supabase
    console.log('New lead:', form)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative z-10 w-[520px] h-full bg-[#0d0d0d] border-l border-[#242424] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1a1a1a] sticky top-0 bg-[#0d0d0d] z-10">
          <div>
            <h2 className="text-sm font-semibold text-white">Nuevo lead</h2>
            <p className="text-xs text-[#71717a] mt-0.5">Cargalo en menos de 30 segundos</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717a] hover:text-white hover:bg-white/5 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5 flex-1">
          {/* Nombre */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre *">
              <input required value={form.first_name} onChange={e => set('first_name', e.target.value)}
                placeholder="Martina" className={inputClass} />
            </Field>
            <Field label="Apellido *">
              <input required value={form.last_name} onChange={e => set('last_name', e.target.value)}
                placeholder="Rodríguez" className={inputClass} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Empresa / Marca">
              <input value={form.company} onChange={e => set('company', e.target.value)}
                placeholder="Consultora MR" className={inputClass} />
            </Field>
            <Field label="Instagram">
              <input value={form.instagram} onChange={e => set('instagram', e.target.value)}
                placeholder="@usuario" className={inputClass} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Email">
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="mail@ejemplo.com" className={inputClass} />
            </Field>
            <Field label="Teléfono">
              <input value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="+54 11 ..." className={inputClass} />
            </Field>
          </div>

          {/* Proyecto + Servicio */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Proyecto Alpha *">
              <select value={form.alpha_project} onChange={e => set('alpha_project', e.target.value)} className={inputClass}>
                {ALPHA_PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Servicio de interés">
              <input value={form.service_interested} onChange={e => set('service_interested', e.target.value)}
                placeholder="Dirección creativa" className={inputClass} />
            </Field>
          </div>

          {/* Estado + Temperatura */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Estado comercial">
              <select value={form.commercial_status} onChange={e => set('commercial_status', e.target.value)} className={inputClass}>
                {COMMERCIAL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Temperatura">
              <select value={form.temperature} onChange={e => set('temperature', e.target.value)} className={inputClass}>
                {TEMPERATURES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>

          {/* Canal + Prioridad */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Canal de entrada">
              <select value={form.entry_channel} onChange={e => set('entry_channel', e.target.value)} className={inputClass}>
                {ENTRY_CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Prioridad">
              <select value={form.priority} onChange={e => set('priority', e.target.value)} className={inputClass}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
          </div>

          {/* Valor + Seguimiento */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Valor estimado (ARS)">
              <input type="number" value={form.estimated_value} onChange={e => set('estimated_value', e.target.value)}
                placeholder="150000" className={inputClass} />
            </Field>
            <Field label="Próximo seguimiento">
              <input type="date" value={form.follow_up_date} onChange={e => set('follow_up_date', e.target.value)} className={inputClass} />
            </Field>
          </div>

          {/* Notas */}
          <Field label="Notas rápidas">
            <textarea value={form.quick_notes} onChange={e => set('quick_notes', e.target.value)}
              rows={3} placeholder="Contexto breve sobre este lead..."
              className={cn(inputClass, 'resize-none')} />
          </Field>

          {/* Actions */}
          <div className="flex gap-2 pt-2 mt-auto">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 rounded-md text-sm text-[#a1a1aa] border border-[#242424] bg-transparent hover:bg-white/[0.03] transition-all">
              Cancelar
            </button>
            <button type="submit"
              className="flex-1 py-2 rounded-md text-sm text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-all font-medium">
              Guardar lead
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const inputClass = 'w-full bg-[#111111] border border-[#242424] rounded-md px-3 py-2 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-[#3f3f46] transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-[#71717a] font-medium">{label}</label>
      {children}
    </div>
  )
}
