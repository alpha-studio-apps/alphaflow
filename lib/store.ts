'use client'

// Simple in-memory store para el MVP (sin Supabase aún)
// Cuando se conecte Supabase, esto se reemplaza por llamadas reales a la DB

import { Lead, Task, Proposal, ContactHistory, Service, EmailTemplate } from '@/types'
import { mockLeads, mockTasks, mockProposals, mockHistory, mockServices, mockEmailTemplates } from './mock-data'

// Leads
let _leads: Lead[] = [...mockLeads]
const _leadsListeners: Array<() => void> = []

export function getLeads(): Lead[] { return _leads }

export function addLead(lead: Lead) {
  _leads = [lead, ..._leads]
  _leadsListeners.forEach(fn => fn())
}

export function updateLead(id: string, updates: Partial<Lead>) {
  _leads = _leads.map(l => l.id === id ? { ...l, ...updates, updated_at: new Date().toISOString() } : l)
  _leadsListeners.forEach(fn => fn())
}

export function deleteLead(id: string) {
  _leads = _leads.filter(l => l.id !== id)
  _leadsListeners.forEach(fn => fn())
}

export function onLeadsChange(fn: () => void) {
  _leadsListeners.push(fn)
  return () => { const i = _leadsListeners.indexOf(fn); if (i > -1) _leadsListeners.splice(i, 1) }
}

// Tasks
let _tasks: Task[] = [...mockTasks]
const _tasksListeners: Array<() => void> = []

export function getTasks(): Task[] { return _tasks }

export function addTask(task: Task) {
  _tasks = [task, ..._tasks]
  _tasksListeners.forEach(fn => fn())
}

export function updateTask(id: string, updates: Partial<Task>) {
  _tasks = _tasks.map(t => t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t)
  _tasksListeners.forEach(fn => fn())
}

export function deleteTask(id: string) {
  _tasks = _tasks.filter(t => t.id !== id)
  _tasksListeners.forEach(fn => fn())
}

export function onTasksChange(fn: () => void) {
  _tasksListeners.push(fn)
  return () => { const i = _tasksListeners.indexOf(fn); if (i > -1) _tasksListeners.splice(i, 1) }
}

// Proposals
let _proposals: Proposal[] = [...mockProposals]
export function getProposals(): Proposal[] { return _proposals }

// History
let _history: ContactHistory[] = [...mockHistory]
export function getHistory(): ContactHistory[] { return _history }
export function addHistory(h: ContactHistory) { _history = [..._history, h] }

// Services
let _services: Service[] = [...mockServices]
const _servicesListeners: Array<() => void> = []

export function getServices(): Service[] { return _services }

export function addService(s: Service) {
  _services = [s, ..._services]
  _servicesListeners.forEach(fn => fn())
}

export function deleteService(id: string) {
  _services = _services.filter(s => s.id !== id)
  _servicesListeners.forEach(fn => fn())
}

export function onServicesChange(fn: () => void) {
  _servicesListeners.push(fn)
  return () => { const i = _servicesListeners.indexOf(fn); if (i > -1) _servicesListeners.splice(i, 1) }
}

// Email Templates
let _emailTemplates: EmailTemplate[] = [...mockEmailTemplates]
const _emailTemplatesListeners: Array<() => void> = []

export function getEmailTemplates(): EmailTemplate[] { return _emailTemplates }

export function addEmailTemplate(t: EmailTemplate) {
  _emailTemplates = [t, ..._emailTemplates]
  _emailTemplatesListeners.forEach(fn => fn())
}

export function deleteEmailTemplate(id: string) {
  _emailTemplates = _emailTemplates.filter(t => t.id !== id)
  _emailTemplatesListeners.forEach(fn => fn())
}

export function onEmailTemplatesChange(fn: () => void) {
  _emailTemplatesListeners.push(fn)
  return () => { const i = _emailTemplatesListeners.indexOf(fn); if (i > -1) _emailTemplatesListeners.splice(i, 1) }
}
