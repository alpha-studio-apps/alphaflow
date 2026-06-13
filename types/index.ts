export type AlphaProject =
  | 'NahuelContent'
  | 'Alpha Studio'
  | 'Alpha Systems'
  | 'Alpha Athlete'
  | 'Alpha Creators'
  | 'ProJump'
  | 'Otro'

export type CommercialStatus =
  | 'Nuevo lead'
  | 'Respondió'
  | 'Necesita diagnóstico'
  | 'Reunión agendada'
  | 'Propuesta enviada'
  | 'Seguimiento pendiente'
  | 'Negociando'
  | 'Cliente activo'
  | 'Pausado'
  | 'Perdido'
  | 'Reactivar más adelante'

export type Temperature = 'Frío' | 'Tibio' | 'Caliente'

export type EntryChannel =
  | 'Instagram'
  | 'WhatsApp'
  | 'Email'
  | 'Web'
  | 'Referido'
  | 'LinkedIn'
  | 'Presencial'
  | 'Otro'

export type Priority = 'Baja' | 'Media' | 'Alta' | 'Urgente'

export type TaskStatus = 'Pendiente' | 'En proceso' | 'Hecho' | 'Vencido'

export type TaskType =
  | 'Seguimiento'
  | 'Propuesta'
  | 'Reunión'
  | 'Entrega'
  | 'Revisión'
  | 'Cobro'
  | 'Diagnóstico'
  | 'Onboarding'
  | 'Reactivación'
  | 'Otro'

export type ProposalStatus =
  | 'Borrador'
  | 'Enviada'
  | 'Vista'
  | 'En negociación'
  | 'Aprobada'
  | 'Rechazada'
  | 'Vencida'

export type InteractionType =
  | 'Primer contacto'
  | 'Respuesta enviada'
  | 'Reunión'
  | 'Propuesta enviada'
  | 'Seguimiento'
  | 'Objeción'
  | 'Cierre'
  | 'Pago'
  | 'Entrega'
  | 'Nota interna'

export interface Lead {
  id: string
  first_name: string
  last_name: string
  company?: string
  email?: string
  phone?: string
  instagram?: string
  website?: string
  alpha_project: AlphaProject
  service_interested?: string
  commercial_status: CommercialStatus
  temperature: Temperature
  entry_channel: EntryChannel
  first_contact_date?: string
  last_contact_date?: string
  next_step?: string
  follow_up_date?: string
  priority: Priority
  estimated_value?: number
  currency?: string
  quick_notes?: string
  is_client: boolean
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  lead_id?: string
  alpha_project: AlphaProject
  title: string
  description?: string
  task_type: TaskType
  status: TaskStatus
  priority: Priority
  due_date?: string
  created_at: string
  updated_at: string
  lead?: Lead
}

export interface Service {
  id: string
  alpha_project: AlphaProject
  name: string
  description?: string
  ideal_client?: string
  problem_solved?: string
  deliverables?: string
  work_process?: string
  base_price?: number
  currency?: string
  duration?: string
  conditions?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface EmailTemplate {
  id: string
  title: string
  alpha_project: AlphaProject
  service_id?: string
  commercial_stage: string
  recommended_temperature?: Temperature
  subject: string
  body: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface ContactHistory {
  id: string
  lead_id: string
  date: string
  interaction_type: InteractionType
  channel?: EntryChannel
  summary: string
  result?: string
  next_action?: string
  created_at: string
}

export interface Proposal {
  id: string
  lead_id: string
  service_id?: string
  title: string
  amount?: number
  currency?: string
  sent_date?: string
  status: ProposalStatus
  proposal_link?: string
  notes?: string
  created_at: string
  updated_at: string
  lead?: Lead
}
