import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  trend?: { value: string; positive?: boolean }
  accent?: string
}

export default function MetricCard({ title, value, subtitle, icon: Icon, iconColor = 'text-[#71717a]', trend, accent }: Props) {
  return (
    <div className="bg-[#111111] border border-[#242424] rounded-xl p-5 flex flex-col gap-3 hover:border-[#2a2a2a] transition-colors">
      <div className="flex items-start justify-between">
        <span className="text-xs text-[#71717a] font-medium tracking-wide uppercase">{title}</span>
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', accent ? '' : 'bg-white/[0.03]')}
          style={accent ? { background: `${accent}15` } : undefined}>
          <Icon className={cn('w-4 h-4', iconColor)} />
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
        {subtitle && <div className="text-xs text-[#71717a] mt-1">{subtitle}</div>}
      </div>
      {trend && (
        <div className={cn('text-xs font-medium', trend.positive ? 'text-emerald-400' : 'text-red-400')}>
          {trend.value}
        </div>
      )}
    </div>
  )
}
