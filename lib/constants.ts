import { AlphaProject, CommercialStatus, Temperature, EntryChannel, Priority, TaskType, TaskStatus, ProposalStatus } from '@/types'

export const ALPHA_PROJECTS: AlphaProject[] = [
  'NahuelContent',
  'Alpha Studio',
  'Alpha Systems',
  'Alpha Athlete',
  'Alpha Creators',
  'ProJump',
  'Otro',
]

export const PROJECT_COLORS: Record<AlphaProject, { accent: string; bg: string; text: string; border: string }> = {
  'NahuelContent': { accent: '#D4D4D8', bg: '#1a1a1a', text: '#FFFFFF', border: '#3f3f46' },
  'Alpha Studio': { accent: '#3B82F6', bg: '#0f1829', text: '#60A5FA', border: '#1e3a5f' },
  'Alpha Systems': { accent: '#3B82F6', bg: '#001a0d', text: '#10B981', border: '#064e3b' },
  'Alpha Athlete': { accent: '#EF4444', bg: '#1a0505', text: '#F87171', border: '#7f1d1d' },
  'Alpha Creators': { accent: '#06B6D4', bg: '#001a1f', text: '#22D3EE', border: '#164e63' },
  'ProJump': { accent: '#A855F7', bg: '#1a0a2e', text: '#C084FC', border: '#4c1d95' },
  'Otro': { accent: '#71717A', bg: '#111111', text: '#A1A1AA', border: '#3f3f46' },
}

export const PROJECT_CLASSES: Record<AlphaProject, string> = {
  'NahuelContent': 'project-nc',
  'Alpha Studio': 'project-studio',
  'Alpha Systems': 'project-systems',
  'Alpha Athlete': 'project-athlete',
  'Alpha Creators': 'project-creators',
  'ProJump': 'project-projump',
  'Otro': 'project-otro',
}

export const COMMERCIAL_STATUSES: CommercialStatus[] = [
  'Nuevo lead',
  'Respondió',
  'Necesita diagnóstico',
  'Reunión agendada',
  'Propuesta enviada',
  'Seguimiento pendiente',
  'Negociando',
  'Cliente activo',
  'Pausado',
  'Perdido',
  'Reactivar más adelante',
]

export const STATUS_COLORS: Record<CommercialStatus, { bg: string; text: string; dot: string }> = {
  'Nuevo lead': { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
  'Respondió': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  'Necesita diagnóstico': { bg: 'bg-violet-500/10', text: 'text-violet-400', dot: 'bg-violet-400' },
  'Reunión agendada': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  'Propuesta enviada': { bg: 'bg-orange-500/10', text: 'text-orange-400', dot: 'bg-orange-400' },
  'Seguimiento pendiente': { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  'Negociando': { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-400' },
  'Cliente activo': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  'Pausado': { bg: 'bg-zinc-500/10', text: 'text-zinc-400', dot: 'bg-zinc-400' },
  'Perdido': { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
  'Reactivar más adelante': { bg: 'bg-pink-500/10', text: 'text-pink-400', dot: 'bg-pink-400' },
}

export const TEMPERATURE_COLORS: Record<Temperature, { bg: string; text: string; icon: string }> = {
  'Frío': { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: '❄️' },
  'Tibio': { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: '🌡️' },
  'Caliente': { bg: 'bg-red-500/10', text: 'text-red-400', icon: '🔥' },
}

export const PRIORITY_COLORS: Record<Priority, { bg: string; text: string }> = {
  'Baja': { bg: 'bg-zinc-500/10', text: 'text-zinc-400' },
  'Media': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'Alta': { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  'Urgente': { bg: 'bg-red-500/10', text: 'text-red-400' },
}

export const TASK_STATUS_COLORS: Record<TaskStatus, { bg: string; text: string }> = {
  'Pendiente': { bg: 'bg-zinc-500/10', text: 'text-zinc-400' },
  'En proceso': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'Hecho': { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  'Vencido': { bg: 'bg-red-500/10', text: 'text-red-400' },
}

export const PROPOSAL_STATUS_COLORS: Record<ProposalStatus, { bg: string; text: string }> = {
  'Borrador': { bg: 'bg-zinc-500/10', text: 'text-zinc-400' },
  'Enviada': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'Vista': { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  'En negociación': { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  'Aprobada': { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  'Rechazada': { bg: 'bg-red-500/10', text: 'text-red-400' },
  'Vencida': { bg: 'bg-amber-500/10', text: 'text-amber-400' },
}

export const ENTRY_CHANNELS: EntryChannel[] = [
  'Instagram', 'WhatsApp', 'Email', 'Web', 'Referido', 'LinkedIn', 'Presencial', 'Otro',
]

export const TEMPERATURES: Temperature[] = ['Frío', 'Tibio', 'Caliente']
export const PRIORITIES: Priority[] = ['Baja', 'Media', 'Alta', 'Urgente']
export const TASK_TYPES: TaskType[] = [
  'Seguimiento', 'Propuesta', 'Reunión', 'Entrega', 'Revisión', 'Cobro', 'Diagnóstico', 'Onboarding', 'Reactivación', 'Otro',
]
export const TASK_STATUSES: TaskStatus[] = ['Pendiente', 'En proceso', 'Hecho', 'Vencido']
export const PROPOSAL_STATUSES: ProposalStatus[] = [
  'Borrador', 'Enviada', 'Vista', 'En negociación', 'Aprobada', 'Rechazada', 'Vencida',
]
