'use client'

import { useState, useEffect } from 'react'
import { CheckSquare, Clock, AlertTriangle, Check, Trash2 } from 'lucide-react'
import Link from 'next/link'
import ProjectBadge from '@/components/ui/ProjectBadge'
import PriorityBadge from '@/components/ui/PriorityBadge'
import EmptyState from '@/components/ui/EmptyState'
import CreateTaskModal from '@/components/modals/CreateTaskModal'
import { getTasks, deleteTask, onTasksChange } from '@/lib/store'
import { ALPHA_PROJECTS, TASK_STATUS_COLORS } from '@/lib/constants'
import { formatDate, isOverdue } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Task, AlphaProject } from '@/types'

type ViewFilter = 'all' | 'today' | 'week' | 'overdue' | 'done'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(() => getTasks())
  const [showModal, setShowModal] = useState(false)
  const [view, setView] = useState<ViewFilter>('all')
  const [filterProject, setFilterProject] = useState<AlphaProject | ''>('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    return onTasksChange(() => setTasks(getTasks()))
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const weekEnd = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]

  const filtered = tasks.filter(t => {
    const matchProject = !filterProject || t.alpha_project === filterProject
    let matchView = true
    if (view === 'today') matchView = t.due_date === today && t.status !== 'Hecho'
    if (view === 'week') matchView = !!t.due_date && t.due_date <= weekEnd && t.status !== 'Hecho'
    if (view === 'overdue') matchView = t.status === 'Vencido' || (!!t.due_date && isOverdue(t.due_date) && t.status !== 'Hecho')
    if (view === 'done') matchView = t.status === 'Hecho'
    return matchProject && matchView
  })

  const counts = {
    all: tasks.length,
    today: tasks.filter(t => t.due_date === today && t.status !== 'Hecho').length,
    week: tasks.filter(t => !!t.due_date && t.due_date <= weekEnd && t.status !== 'Hecho').length,
    overdue: tasks.filter(t => t.status === 'Vencido' || (!!t.due_date && isOverdue(t.due_date) && t.status !== 'Hecho')).length,
    done: tasks.filter(t => t.status === 'Hecho').length,
  }

  function handleDelete(id: string) {
    if (confirmDelete === id) {
      deleteTask(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  const views: { key: ViewFilter; label: string; icon: any }[] = [
    { key: 'all', label: 'Todas', icon: CheckSquare },
    { key: 'today', label: 'Hoy', icon: Clock },
    { key: 'week', label: 'Esta semana', icon: CalendarIcon },
    { key: 'overdue', label: 'Vencidas', icon: AlertTriangle },
    { key: 'done', label: 'Completadas', icon: Check },
  ]

  return (
    <>
      <div className="max-w-[1000px] mx-auto space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Tareas</h1>
            <p className="text-sm text-[#71717a] mt-1">{filtered.length} tarea{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-all font-medium">
            + Nueva tarea
          </button>
        </div>

        {/* View tabs */}
        <div className="flex gap-1 bg-[#0d0d0d] border border-[#242424] rounded-xl p-1 overflow-x-auto">
          {views.map(v => (
            <button key={v.key} onClick={() => setView(v.key)}
              className={cn('flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all',
                view === v.key ? 'bg-[#1a1a1a] text-white font-medium' : 'text-[#71717a] hover:text-white'
              )}>
              <v.icon className="w-3.5 h-3.5" />
              {v.label}
              {counts[v.key] > 0 && (
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full',
                  v.key === 'overdue' ? 'bg-red-500/15 text-red-400' : 'bg-white/5 text-[#71717a]'
                )}>{counts[v.key]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Project filter */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterProject('')}
            className={cn('px-3 py-1.5 rounded-md text-xs transition-all border',
              !filterProject ? 'border-[#3f3f46] text-white bg-white/5' : 'border-[#242424] text-[#71717a] hover:text-white hover:border-[#3f3f46]'
            )}>
            Todos los proyectos
          </button>
          {ALPHA_PROJECTS.map(p => (
            <button key={p} onClick={() => setFilterProject(p === filterProject ? '' : p)}
              className={cn('px-3 py-1.5 rounded-md text-xs transition-all border',
                filterProject === p ? 'border-[#3f3f46] text-white bg-white/5' : 'border-[#242424] text-[#71717a] hover:text-white hover:border-[#3f3f46]'
              )}>
              {p}
            </button>
          ))}
        </div>

        {/* Tasks list */}
        <div className="bg-[#111111] border border-[#242424] rounded-xl overflow-hidden">
          {tasks.length === 0 ? (
            <EmptyState icon={CheckSquare} title="Todavía no hay tareas" description="Creá una tarea desde aquí o desde la ficha de un lead." />
          ) : filtered.length === 0 ? (
            <EmptyState icon={CheckSquare} title="Sin tareas para este filtro" description="Probá cambiando la vista o el proyecto." />
          ) : (
            <div className="divide-y divide-[#1a1a1a]">
              {filtered.map(task => (
                <div key={task.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group">
                  <div className={cn('w-2 h-2 rounded-full shrink-0',
                    TASK_STATUS_COLORS[task.status].text.replace('text-', 'bg-')
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <ProjectBadge project={task.alpha_project} size="sm" />
                      <span className="text-xs text-[#71717a]">{task.task_type}</span>
                      {task.lead && (
                        <Link href={`/leads/${task.lead_id}`} className="text-xs text-[#71717a] hover:text-white transition-colors">
                          {task.lead.first_name} {task.lead.last_name}
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <PriorityBadge priority={task.priority} size="sm" />
                    <span className={cn('text-xs px-2 py-0.5 rounded-full',
                      TASK_STATUS_COLORS[task.status].bg, TASK_STATUS_COLORS[task.status].text
                    )}>{task.status}</span>
                    {task.due_date && (
                      <span className={cn('text-xs whitespace-nowrap',
                        isOverdue(task.due_date) && task.status !== 'Hecho' ? 'text-red-400' : 'text-[#71717a]'
                      )}>
                        {formatDate(task.due_date, { day: '2-digit', month: 'short' })}
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(task.id)}
                      title={confirmDelete === task.id ? 'Confirmar eliminación' : 'Eliminar tarea'}
                      className={cn(
                        'w-7 h-7 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all',
                        confirmDelete === task.id
                          ? 'bg-red-500/20 text-red-400 opacity-100'
                          : 'text-[#3f3f46] hover:text-red-400 hover:bg-red-500/10'
                      )}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateTaskModal open={showModal} onClose={() => setShowModal(false)} />

      {confirmDelete && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-red-500/30 rounded-xl px-5 py-3 text-sm text-red-400 shadow-xl z-50">
          Hacé click de nuevo para confirmar la eliminación
        </div>
      )}
    </>
  )
}

function CalendarIcon(props: any) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
}
