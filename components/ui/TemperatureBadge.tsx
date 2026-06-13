import { Temperature } from '@/types'
import { TEMPERATURE_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Props {
  temperature: Temperature
  size?: 'sm' | 'md'
  showIcon?: boolean
}

export default function TemperatureBadge({ temperature, size = 'md', showIcon = true }: Props) {
  const colors = TEMPERATURE_COLORS[temperature]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap',
        colors.bg,
        colors.text,
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      )}
    >
      {showIcon && <span className="text-[10px]">{colors.icon}</span>}
      {temperature}
    </span>
  )
}
