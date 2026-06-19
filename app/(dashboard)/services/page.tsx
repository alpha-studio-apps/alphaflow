'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, X, Briefcase } from 'lucide-react'
import ProjectBadge from '@/components/ui/ProjectBadge'
import EmptyState from '@/components/ui/EmptyState'
import { getServices, loadServices, addService, deleteService, onServicesChange } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { ALPHA_PROJECTS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Service } from '@/types'

const DURATIONS = ['Mensual', 'Trimestral', 'Anual', 'Por proyecto', 'Proyecto único', 'Por hora']

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(() => getServices())
  const [showModal, setShowModal] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    loadServices()
    return onServicesChange(() => setServices(getServices()))
  }, [])

  function handleDelete(id: string) {
    if (confirmDelete === id) {
      deleteService(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  return (
    <div className="max-w-[1100px] mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Servicios</h1>
          <p className="text-sm text-[#71717a] mt-1">Catálogo de servicios del ecosistema Alpha</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-all font-medium shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Nuevo servicio</span>
          <span className="sm:hidden">Nuevo</span>
        </button>
      </div>

      {services.length === 0 ? (
        <div className="bg-[#111111] border border-[#242424] rounded-xl">
          <EmptyState
            icon={Briefcase}
            title="Sin servicios cargados"
            description="Agregá los servicios que ofrecés para tenerlos de referencia al armar propuestas."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map(service => (
            <div key={service.id} className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden group">
              <div className="px-5 py-4 border-b border-[#1a1a1a] flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">{service.name}</h3>
                  <div className="mt-1.5">
                    <ProjectBadge project={service.alpha_project} size="sm" />
                  </div>
                </div>
                <div className="flex items-start gap-2 shrink-0">
                  {service.base_price && (
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{formatCurrency(service.base_price, service.currency)}</p>
                      <p className="text-xs text-[#71717a]">{service.duration}</p>
                    </div>
                  )}
                  <button
                    onClick={() => handleDelete(service.id)}
                    title={confirmDelete === service.id ? 'Hacé click de nuevo para confirmar' : 'Eliminar servicio'}
                    className={cn(
                      'w-7 h-7 rounded-md flex items-center justify-center transition-all mt-0.5',
                      confirmDelete === service.id
                        ? 'bg-red-500/20 text-red-400'
                        : 'text-[#3f3f46] hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100'
                    )}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
      )}

      {confirmDelete && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-red-500/30 rounded-xl px-5 py-3 text-sm text-red-400 shadow-xl z-50">
          Hacé click de nuevo en el ícono para confirmar la eliminación
        </div>
      )}

      {showModal && <CreateServiceModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

function CreateServiceModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: '',
    alpha_project: 'NahuelContent',
    description: '',
    ideal_client: '',
    problem_solved: '',
    deliverables: '',
    base_price: '',
    currency: 'ARS',
    duration: 'Mensual',
  })

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await addService({
      alpha_project: form.alpha_project as Service['alpha_project'],
      name: form.name,
      description: form.description || undefined,
      ideal_client: form.ideal_client || undefined,
      problem_solved: form.problem_solved || undefined,
      deliverables: form.deliverables || undefined,
      base_price: form.base_price ? Number(form.base_price) : undefined,
      currency: form.currency as 'ARS' | 'USD',
      duration: form.duration,
      active: true,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:w-[560px] sm:max-w-[calc(100vw-2rem)] max-h-[92dvh] bg-[#0d0d0d] sm:border border-t sm:border-t border-[#242424] rounded-t-2xl sm:rounded-xl overflow-y-auto">
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#2a2a2a]" />
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a] sticky top-0 bg-[#0d0d0d] z-10">
          <h2 className="text-sm font-semibold text-white">Nuevo servicio</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center text-[#71717a] hover:text-white hover:bg-white/5 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Nombre del servicio *">
              <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Dirección creativa" className={inputClass} />
            </Field>
            <Field label="Proyecto Alpha">
              <select value={form.alpha_project} onChange={e => set('alpha_project', e.target.value)} className={inputClass}>
                {ALPHA_PROJECTS.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Descripción">
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Qué incluye el servicio..." className={cn(inputClass, 'resize-none')} />
          </Field>
          <Field label="Cliente ideal">
            <input value={form.ideal_client} onChange={e => set('ideal_client', e.target.value)} placeholder="A quién va dirigido" className={inputClass} />
          </Field>
          <Field label="Problema que resuelve">
            <input value={form.problem_solved} onChange={e => set('problem_solved', e.target.value)} placeholder="El dolor que sana" className={inputClass} />
          </Field>
          <Field label="Entregables">
            <textarea value={form.deliverables} onChange={e => set('deliverables', e.target.value)} rows={2} placeholder="Qué recibe el cliente..." className={cn(inputClass, 'resize-none')} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Precio base">
              <input type="number" value={form.base_price} onChange={e => set('base_price', e.target.value)} placeholder="150000" className={inputClass} />
            </Field>
            <Field label="Moneda">
              <select value={form.currency} onChange={e => set('currency', e.target.value)} className={inputClass}>
                <option>ARS</option>
                <option>USD</option>
              </select>
            </Field>
            <Field label="Duración">
              <select value={form.duration} onChange={e => set('duration', e.target.value)} className={inputClass}>
                {DURATIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
          </div>
          <div className="flex gap-2 pt-1 pb-safe">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-md text-sm text-[#a1a1aa] border border-[#242424] hover:bg-white/[0.03] transition-all">Cancelar</button>
            <button type="submit" className="flex-1 py-2.5 rounded-md text-sm text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-all font-medium">Guardar servicio</button>
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
