'use client'

import { useState } from 'react'
import { Settings, Trash2 } from 'lucide-react'
import { ALPHA_PROJECTS, PROJECT_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const STORAGE_KEYS = [
  'alphaflow_leads',
  'alphaflow_tasks',
  'alphaflow_proposals',
  'alphaflow_history',
  'alphaflow_services',
  'alphaflow_email_templates',
]

export default function SettingsPage() {
  const [confirmReset, setConfirmReset] = useState(false)

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true)
      setTimeout(() => setConfirmReset(false), 4000)
      return
    }
    STORAGE_KEYS.forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Configuración</h1>
        <p className="text-sm text-[#71717a] mt-1">Configuración del sistema AlphaFlow</p>
      </div>

      {/* Alpha Projects */}
      <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1a1a1a]">
          <h2 className="text-sm font-semibold text-white">Proyectos Alpha</h2>
          <p className="text-xs text-[#71717a] mt-0.5">Unidades del ecosistema configuradas</p>
        </div>
        <div className="p-5 space-y-3">
          {ALPHA_PROJECTS.map(p => {
            const color = PROJECT_COLORS[p]
            return (
              <div key={p} className="flex items-center gap-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg px-4 py-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color.accent }} />
                <span className="text-sm text-white flex-1">{p}</span>
                <span className="text-xs font-mono text-[#3f3f46]">{color.accent}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-[#111111] border border-red-500/20 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-red-500/10">
          <h2 className="text-sm font-semibold text-red-400">Zona de peligro</h2>
          <p className="text-xs text-[#71717a] mt-0.5">Acciones irreversibles sobre los datos locales</p>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-white font-medium">Limpiar todos los datos</p>
              <p className="text-xs text-[#71717a] mt-0.5">
                Borra todos los leads, tareas, servicios, mails y propuestas guardados en este navegador. No se puede deshacer.
              </p>
            </div>
            <button
              onClick={handleReset}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm border transition-all shrink-0 font-medium',
                confirmReset
                  ? 'bg-red-500 text-white border-red-500'
                  : 'text-red-400 border-red-500/30 bg-red-500/5 hover:bg-red-500/10'
              )}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {confirmReset ? 'Confirmar — borrar todo' : 'Limpiar datos'}
            </button>
          </div>
        </div>
      </div>

      {/* Supabase config */}
      <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1a1a1a]">
          <h2 className="text-sm font-semibold text-white">Base de datos</h2>
          <p className="text-xs text-[#71717a] mt-0.5">Conexión con Supabase (próximamente)</p>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="text-xs text-[#71717a] font-medium block mb-1.5">NEXT_PUBLIC_SUPABASE_URL</label>
            <input disabled value="Configurar en .env.local" className="w-full bg-[#0d0d0d] border border-[#1a1a1a] rounded-md px-3 py-2 text-sm text-[#3f3f46]" />
          </div>
          <div>
            <label className="text-xs text-[#71717a] font-medium block mb-1.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</label>
            <input disabled value="Configurar en .env.local" className="w-full bg-[#0d0d0d] border border-[#1a1a1a] rounded-md px-3 py-2 text-sm text-[#3f3f46]" />
          </div>
          <p className="text-xs text-[#3f3f46]">
            Cuando conectes Supabase, los datos migrarán automáticamente de localStorage a la base de datos.
          </p>
        </div>
      </div>

      {/* System info */}
      <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1a1a1a]">
          <h2 className="text-sm font-semibold text-white">Sistema</h2>
        </div>
        <div className="p-5 space-y-2">
          {[
            ['Versión', 'v1.0 MVP'],
            ['Stack', 'Next.js 16 · TypeScript · Tailwind CSS'],
            ['Persistencia', 'localStorage (hasta conectar Supabase)'],
            ['Deploy', 'Vercel · alphaflow-kappa.vercel.app'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-1.5">
              <span className="text-xs text-[#71717a]">{k}</span>
              <span className="text-xs text-[#a1a1aa]">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
