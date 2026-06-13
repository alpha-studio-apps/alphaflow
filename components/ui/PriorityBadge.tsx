import { Priority } from '@/types'
import { PRIORITY_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Props {
  priority: Priority
  size?: 'sm' | 'md'
}

export default function PriorityBadge({ priority, size = 'md' }: Props) {
  const colors = PRIORITY_COLORS[priority]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium whitespace-nowrap',
        colors.bg,
        colors.text,
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      )}
    >
      {priority}
    </span>
  )
}
