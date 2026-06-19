'use client'

// Cache local sincronizado con Supabase.
// getX() devuelve el cache (síncrono, igual que antes).
// loadX() fetcha Supabase y actualiza el cache.
// addX/deleteX/updateX mutean Supabase y actualizan el cache en el acto.

import { Lead, Task, Proposal, ContactHistory, Service, EmailTemplate } from '@/types'
import { supabase } from './supabase'

// ─── listeners ───────────────────────────────────────────────────────────────
function makeListeners() {
  const fns: Array<() => void> = []
  return {
    notify: () => fns.forEach(fn => fn()),
    subscribe: (fn: () => void) => {
      fns.push(fn)
      return () => { const i = fns.indexOf(fn); if (i > -1) fns.splice(i, 1) }
    },
  }
}

// ─── LEADS ───────────────────────────────────────────────────────────────────
let _leads: Lead[] = []
const _leadsEvents = makeListeners()

export function getLeads(): Lead[] { return _leads }
export function onLeadsChange(fn: () => void) { return _leadsEvents.subscribe(fn) }

export async function loadLeads() {
  const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
  _leads = (data ?? []) as Lead[]
  _leadsEvents.notify()
}

export async function addLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
  const { data } = await supabase.from('leads').insert(lead).select().single()
  if (data) { _leads = [data as Lead, ..._leads]; _leadsEvents.notify() }
}

export async function updateLead(id: string, updates: Partial<Lead>) {
  const { data } = await supabase.from('leads').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (data) { _leads = _leads.map(l => l.id === id ? data as Lead : l); _leadsEvents.notify() }
}

export async function deleteLead(id: string) {
  await supabase.from('leads').delete().eq('id', id)
  _leads = _leads.filter(l => l.id !== id)
  _leadsEvents.notify()
}

// ─── TASKS ───────────────────────────────────────────────────────────────────
let _tasks: Task[] = []
const _tasksEvents = makeListeners()

export function getTasks(): Task[] { return _tasks }
export function onTasksChange(fn: () => void) { return _tasksEvents.subscribe(fn) }

export async function loadTasks() {
  const { data } = await supabase.from('tasks').select('*, lead:leads(first_name, last_name)').order('created_at', { ascending: false })
  _tasks = (data ?? []) as Task[]
  _tasksEvents.notify()
}

export async function addTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'lead'>) {
  const { data } = await supabase.from('tasks').insert(task).select('*, lead:leads(first_name, last_name)').single()
  if (data) { _tasks = [data as Task, ..._tasks]; _tasksEvents.notify() }
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const { data } = await supabase.from('tasks').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select('*, lead:leads(first_name, last_name)').single()
  if (data) { _tasks = _tasks.map(t => t.id === id ? data as Task : t); _tasksEvents.notify() }
}

export async function deleteTask(id: string) {
  await supabase.from('tasks').delete().eq('id', id)
  _tasks = _tasks.filter(t => t.id !== id)
  _tasksEvents.notify()
}

// ─── SERVICES ────────────────────────────────────────────────────────────────
let _services: Service[] = []
const _servicesEvents = makeListeners()

export function getServices(): Service[] { return _services }
export function onServicesChange(fn: () => void) { return _servicesEvents.subscribe(fn) }

export async function loadServices() {
  const { data } = await supabase.from('services').select('*').order('created_at', { ascending: false })
  _services = (data ?? []) as Service[]
  _servicesEvents.notify()
}

export async function addService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) {
  const { data } = await supabase.from('services').insert(service).select().single()
  if (data) { _services = [data as Service, ..._services]; _servicesEvents.notify() }
}

export async function deleteService(id: string) {
  await supabase.from('services').delete().eq('id', id)
  _services = _services.filter(s => s.id !== id)
  _servicesEvents.notify()
}

// ─── EMAIL TEMPLATES ─────────────────────────────────────────────────────────
let _emailTemplates: EmailTemplate[] = []
const _emailTemplatesEvents = makeListeners()

export function getEmailTemplates(): EmailTemplate[] { return _emailTemplates }
export function onEmailTemplatesChange(fn: () => void) { return _emailTemplatesEvents.subscribe(fn) }

export async function loadEmailTemplates() {
  const { data } = await supabase.from('email_templates').select('*').order('created_at', { ascending: false })
  _emailTemplates = (data ?? []) as EmailTemplate[]
  _emailTemplatesEvents.notify()
}

export async function addEmailTemplate(template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) {
  const { data } = await supabase.from('email_templates').insert(template).select().single()
  if (data) { _emailTemplates = [data as EmailTemplate, ..._emailTemplates]; _emailTemplatesEvents.notify() }
}

export async function deleteEmailTemplate(id: string) {
  await supabase.from('email_templates').delete().eq('id', id)
  _emailTemplates = _emailTemplates.filter(t => t.id !== id)
  _emailTemplatesEvents.notify()
}

// ─── PROPOSALS ───────────────────────────────────────────────────────────────
let _proposals: Proposal[] = []

export function getProposals(): Proposal[] { return _proposals }

export async function loadProposals() {
  const { data } = await supabase.from('proposals').select('*, lead:leads(first_name, last_name)').order('created_at', { ascending: false })
  _proposals = (data ?? []) as Proposal[]
}

export async function addProposal(proposal: Omit<Proposal, 'id' | 'created_at' | 'updated_at'>) {
  const { data } = await supabase.from('proposals').insert(proposal).select().single()
  if (data) _proposals = [data as Proposal, ..._proposals]
}

// ─── HISTORY ─────────────────────────────────────────────────────────────────
export async function getHistory(leadId?: string): Promise<ContactHistory[]> {
  let q = supabase.from('contact_history').select('*').order('date', { ascending: false })
  if (leadId) q = q.eq('lead_id', leadId)
  const { data } = await q
  return (data ?? []) as ContactHistory[]
}

export async function addHistory(h: Omit<ContactHistory, 'id' | 'created_at'>) {
  await supabase.from('contact_history').insert(h)
}
