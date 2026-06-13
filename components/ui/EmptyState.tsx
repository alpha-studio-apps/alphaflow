import { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-[#242424] flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-[#3f3f46]" />
      </div>
      <h3 className="text-sm font-medium text-white mb-1">{title}</h3>
      {description && <p className="text-xs text-[#71717a] max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
