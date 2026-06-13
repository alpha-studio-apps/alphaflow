import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | undefined, opts?: Intl.DateTimeFormatOptions): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('es-AR', opts ?? { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatCurrency(amount: number | undefined, currency = 'ARS'): string {
  if (amount === undefined || amount === null) return '—'
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

export function isOverdue(date: string | undefined): boolean {
  if (!date) return false
  return new Date(date) < new Date()
}

export function daysUntil(date: string | undefined): number | null {
  if (!date) return null
  const diff = new Date(date).getTime() - new Date().getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function replaceTemplateVars(body: string, vars: Record<string, string>): string {
  return body.replace(/\[(\w+)\]/g, (_, key) => vars[key] ?? `[${key}]`)
}
