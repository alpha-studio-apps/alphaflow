import { CommercialStatus } from '@/types'
import { STATUS_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Props {
  status: CommercialStatus
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const colors = STATUS_COLORS[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap',
        colors.bg,
        colors.text,
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      )}
    >
      <span className={cn('rounded-full shrink-0', colors.dot, size === 'sm' ? 'w-1 h-1' : 'w-1.5 h-1.5')} />
      {status}
    </span>
  )
}
