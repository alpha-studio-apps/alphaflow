import { AlphaProject } from '@/types'
import { PROJECT_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Props {
  project: AlphaProject
  size?: 'sm' | 'md'
}

export default function ProjectBadge({ project, size = 'md' }: Props) {
  const colors = PROJECT_COLORS[project] ?? { bg: '#111111', text: '#a1a1aa', border: '#3f3f46' }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium whitespace-nowrap border',
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      )}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      {project}
    </span>
  )
}
