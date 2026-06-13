import { Settings, Zap } from 'lucide-react'
import { ALPHA_PROJECTS, PROJECT_COLORS } from '@/lib/constants'

export default function SettingsPage() {
  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Configuración</h1>
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

      {/* Supabase config */}
      <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1a1a1a]">
          <h2 className="text-sm font-semibold text-white">Base de datos</h2>
          <p className="text-xs text-[#71717a] mt-0.5">Conexión con Supabase</p>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="text-xs text-[#71717a] font-medium block mb-1.5">NEXT_PUBLIC_SUPABASE_URL</label>
            <input
              disabled
              value="Configurar en .env.local"
              className="w-full bg-[#0d0d0d] border border-[#1a1a1a] rounded-md px-3 py-2 text-sm text-[#3f3f46]"
            />
          </div>
          <div>
            <label className="text-xs text-[#71717a] font-medium block mb-1.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</label>
            <input
              disabled
              value="Configurar en .env.local"
              className="w-full bg-[#0d0d0d] border border-[#1a1a1a] rounded-md px-3 py-2 text-sm text-[#3f3f46]"
            />
          </div>
          <p className="text-xs text-[#3f3f46]">
            Creá un archivo <code className="bg-[#1a1a1a] px-1 py-0.5 rounded text-[#71717a]">.env.local</code> en la raíz del proyecto con tus credenciales de Supabase.
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
            ['Versión', 'v1.0.0 MVP'],
            ['Stack', 'Next.js 16 · TypeScript · Tailwind CSS'],
            ['Estado de datos', 'Mock data (sin Supabase conectado)'],
            ['Deploy', 'Vercel ready'],
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
