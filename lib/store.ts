'use client'

// In-memory store con persistencia en localStorage (hasta que se conecte Supabase)

import { Lead, Task, Proposal, ContactHistory, Service, EmailTemplate } from '@/types'

// localStorage helpers
function load<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function save<T>(key: string, data: T[]) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(data)) } catch {}
}

// Leads
let _leads: Lead[] = load('alphaflow_leads', [])
const _leadsListeners: Array<() => void> = []

export function getLeads(): Lead[] { return _leads }

export function addLead(lead: Lead) {
  _leads = [lead, ..._leads]
  save('alphaflow_leads', _leads)
  _leadsListeners.forEach(fn => fn())
}

export function updateLead(id: string, updates: Partial<Lead>) {
  _leads = _leads.map(l => l.id === id ? { ...l, ...updates, updated_at: new Date().toISOString() } : l)
  save('alphaflow_leads', _leads)
  _leadsListeners.forEach(fn => fn())
}

export function deleteLead(id: string) {
  _leads = _leads.filter(l => l.id !== id)
  save('alphaflow_leads', _leads)
  _leadsListeners.forEach(fn => fn())
}

export function onLeadsChange(fn: () => void) {
  _leadsListeners.push(fn)
  return () => { const i = _leadsListeners.indexOf(fn); if (i > -1) _leadsListeners.splice(i, 1) }
}

// Tasks
let _tasks: Task[] = load('alphaflow_tasks', [])
const _tasksListeners: Array<() => void> = []

export function getTasks(): Task[] { return _tasks }

export function addTask(task: Task) {
  _tasks = [task, ..._tasks]
  save('alphaflow_tasks', _tasks)
  _tasksListeners.forEach(fn => fn())
}

export function updateTask(id: string, updates: Partial<Task>) {
  _tasks = _tasks.map(t => t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t)
  save('alphaflow_tasks', _tasks)
  _tasksListeners.forEach(fn => fn())
}

export function deleteTask(id: string) {
  _tasks = _tasks.filter(t => t.id !== id)
  save('alphaflow_tasks', _tasks)
  _tasksListeners.forEach(fn => fn())
}

export function onTasksChange(fn: () => void) {
  _tasksListeners.push(fn)
  return () => { const i = _tasksListeners.indexOf(fn); if (i > -1) _tasksListeners.splice(i, 1) }
}

// Proposals
let _proposals: Proposal[] = load('alphaflow_proposals', [])
export function getProposals(): Proposal[] { return _proposals }
export function addProposal(p: Proposal) {
  _proposals = [p, ..._proposals]
  save('alphaflow_proposals', _proposals)
}
export function deleteProposal(id: string) {
  _proposals = _proposals.filter(p => p.id !== id)
  save('alphaflow_proposals', _proposals)
}

// History
let _history: ContactHistory[] = load('alphaflow_history', [])
export function getHistory(): ContactHistory[] { return _history }
export function addHistory(h: ContactHistory) {
  _history = [..._history, h]
  save('alphaflow_history', _history)
}

// Services
let _services: Service[] = load('alphaflow_services', [])
const _servicesListeners: Array<() => void> = []

export function getServices(): Service[] { return _services }

export function addService(s: Service) {
  _services = [s, ..._services]
  save('alphaflow_services', _services)
  _servicesListeners.forEach(fn => fn())
}

export function deleteService(id: string) {
  _services = _services.filter(s => s.id !== id)
  save('alphaflow_services', _services)
  _servicesListeners.forEach(fn => fn())
}

export function onServicesChange(fn: () => void) {
  _servicesListeners.push(fn)
  return () => { const i = _servicesListeners.indexOf(fn); if (i > -1) _servicesListeners.splice(i, 1) }
}

// Email Templates
let _emailTemplates: EmailTemplate[] = load('alphaflow_email_templates', [])
const _emailTemplatesListeners: Array<() => void> = []

export function getEmailTemplates(): EmailTemplate[] { return _emailTemplates }

export function addEmailTemplate(t: EmailTemplate) {
  _emailTemplates = [t, ..._emailTemplates]
  save('alphaflow_email_templates', _emailTemplates)
  _emailTemplatesListeners.forEach(fn => fn())
}

export function deleteEmailTemplate(id: string) {
  _emailTemplates = _emailTemplates.filter(t => t.id !== id)
  save('alphaflow_email_templates', _emailTemplates)
  _emailTemplatesListeners.forEach(fn => fn())
}

export function onEmailTemplatesChange(fn: () => void) {
  _emailTemplatesListeners.push(fn)
  return () => { const i = _emailTemplatesListeners.indexOf(fn); if (i > -1) _emailTemplatesListeners.splice(i, 1) }
}
