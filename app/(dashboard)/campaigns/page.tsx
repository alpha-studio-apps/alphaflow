'use client'

import { useState, useEffect, useCallback } from 'react'
import { Send, Users, ChevronDown, CheckCircle2, AlertCircle, Loader2, Megaphone } from 'lucide-react'
import { ALPHA_PROJECTS, TEMPERATURES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const FROM_OPTIONS = [
  { label: 'Nahuel', value: 'Nahuel' },
  { label: 'NahuelContent', value: 'NahuelContent' },
  { label: 'Alpha Studio', value: 'Alpha Studio' },
  { label: 'Alpha Systems', value: 'Alpha Systems' },
  { label: 'ProJump', value: 'ProJump' },
]

interface PreviewData {
  count: number
  sample: { first_name: string; email: string }[]
}

export default function CampaignsPage() {
  const [form, setForm] = useState({
    subject: '',
    body: '',
    fromName: 'Nahuel',
    replyTo: 'nahuelcontent@gmail.com',
    filter_project: '',
    filter_temperature: '',
    filter_is_client: '',
  })
  const [preview, setPreview] = useState<PreviewData | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number; errors: string[] } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirm, setConfirm] = useState(false)

  const fetchPreview = useCallback(async () => {
    setLoadingPreview(true)
    const params = new URLSearchParams()
    if (form.filter_project) params.set('alpha_project', form.filter_project)
    if (form.filter_temperature) params.set('temperature', form.filter_temperature)
    if (form.filter_is_client) params.set('is_client', form.filter_is_client)
    const res = await fetch(`/api/campaigns?${params}`)
    const data = await res.json()
    setPreview(data)
    setLoadingPreview(false)
  }, [form.filter_project, form.filter_temperature, form.filter_is_client])

  useEffect(() => { fetchPreview() }, [fetchPreview])

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
    setResult(null)
    setError(null)
    setConfirm(false)
  }

  async function handleSend() {
    if (!confirm) { setConfirm(true); return }
    setSending(true)
    setError(null)
    setResult(null)
    setConfirm(false)
    try {
      const filter: Record<string, unknown> = {}
      if (form.filter_project) filter.alpha_project = form.filter_project
      if (form.filter_temperature) filter.temperature = form.filter_temperature
      if (form.filter_is_client === 'true') filter.is_client = true
      if (form.filter_is_client === 'false') filter.is_client = false

      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: form.subject,
          body: form.body,
          fromName: form.fromName,
          replyTo: form.replyTo,
          filter,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al enviar.'); return }
      setResult({ sent: data.sent, failed: data.failed, errors: data.errors })
    } catch {
      setError('Error de red al enviar.')
    } finally {
      setSending(false)
    }
  }

  const canSend = form.subject.trim() && form.body.trim() && (preview?.count ?? 0) > 0

  return (
    <div className="max-w-[780px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center">
            <Megaphone className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Campañas de email</h1>
        </div>
        <p className="text-sm text-[#71717a] ml-11">Enviá emails masivos a tus leads desde nahuelcontent.com</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-5">
        {/* Formulario */}
        <div className="space-y-4">
          <Section title="Remitente y respuesta">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Enviar como">
                <select value={form.fromName} onChange={e => set('fromName', e.target.value)} className={inputClass}>
                  {FROM_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
              <Field label="Reply-to">
                <input value={form.replyTo} onChange={e => set('replyTo', e.target.value)} className={inputClass} placeholder="tu@email.com" />
              </Field>
            </div>
            <p className="text-xs text-[#3f3f46] mt-1">Se envía desde <span className="text-[#71717a]">noreply@nahuelcontent.com</span> pero las respuestas llegan al reply-to.</p>
          </Section>

          <Section title="Contenido del email">
            <Field label="Asunto *">
              <input
                value={form.subject}
                onChange={e => set('subject', e.target.value)}
                placeholder="Ej: Tengo algo para vos 👀"
                className={inputClass}
              />
            </Field>
            <Field label="Cuerpo *">
              <textarea
                value={form.body}
                onChange={e => set('body', e.target.value)}
                rows={10}
                placeholder={`Hola [Nombre],\n\n...\n\nSaludos,\nNahuel`}
                className={cn(inputClass, 'resize-none font-mono text-xs leading-relaxed')}
              />
            </Field>
            <p className="text-xs text-[#3f3f46]">Usá <span className="text-[#71717a]">[Nombre]</span> para personalizar con el nombre del lead.</p>
          </Section>
        </div>

        {/* Panel derecho: filtros + preview */}
        <div className="space-y-4">
          <Section title="Filtrar destinatarios">
            <Field label="Proyecto">
              <select value={form.filter_project} onChange={e => set('filter_project', e.target.value)} className={inputClass}>
                <option value="">Todos los proyectos</option>
                {ALPHA_PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Temperatura">
              <select value={form.filter_temperature} onChange={e => set('filter_temperature', e.target.value)} className={inputClass}>
                <option value="">Todas</option>
                {TEMPERATURES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Tipo">
              <select value={form.filter_is_client} onChange={e => set('filter_is_client', e.target.value)} className={inputClass}>
                <option value="">Leads y clientes</option>
                <option value="true">Solo clientes</option>
                <option value="false">Solo leads</option>
              </select>
            </Field>
          </Section>

          {/* Preview de destinatarios */}
          <div className="bg-[#111111] border border-[#242424] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#71717a] font-medium uppercase tracking-wide">Destinatarios</span>
              {loadingPreview && <Loader2 className="w-3.5 h-3.5 text-[#3f3f46] animate-spin" />}
            </div>
            {preview && (
              <>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-2xl font-bold text-white">{preview.count}</span>
                  <span className="text-sm text-[#71717a]">con email</span>
                </div>
                {preview.sample.length > 0 && (
                  <div className="space-y-1.5 border-t border-[#1a1a1a] pt-3">
                    <p className="text-[10px] text-[#3f3f46] uppercase tracking-wider">Muestra</p>
                    {preview.sample.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[9px] text-[#71717a] shrink-0">
                          {s.first_name?.[0] ?? '?'}
                        </div>
                        <span className="text-xs text-[#a1a1aa] truncate">{s.email}</span>
                      </div>
                    ))}
                    {preview.count > 3 && (
                      <p className="text-xs text-[#3f3f46]">+{preview.count - 3} más...</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Resultado */}
          {result && (
            <div className={cn(
              'rounded-xl border p-4 space-y-1',
              result.failed === 0 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'
            )}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium text-emerald-400">{result.sent} enviados</span>
              </div>
              {result.failed > 0 && (
                <p className="text-xs text-amber-400">{result.failed} fallaron</p>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Botón enviar */}
          <button
            onClick={handleSend}
            disabled={!canSend || sending}
            className={cn(
              'w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all',
              confirm
                ? 'bg-amber-500 hover:bg-amber-400 text-white'
                : canSend && !sending
                ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                : 'bg-[#1a1a1a] text-[#3f3f46] cursor-not-allowed'
            )}
          >
            {sending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
            ) : confirm ? (
              <><Send className="w-4 h-4" /> Confirmar envío a {preview?.count} personas</>
            ) : (
              <><Send className="w-4 h-4" /> Enviar campaña</>
            )}
          </button>
          {confirm && (
            <p className="text-xs text-center text-amber-400 -mt-2">Hacé click de nuevo para confirmar</p>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#111111] border border-[#242424] rounded-xl p-4 space-y-3">
      <p className="text-xs text-[#71717a] font-medium uppercase tracking-wide">{title}</p>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-[#71717a]">{label}</label>
      {children}
    </div>
  )
}

const inputClass = 'w-full bg-[#0d0d0d] border border-[#1a1a1a] rounded-md px-3 py-2 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-[#3f3f46] transition-colors'
