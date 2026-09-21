interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export const PageHeader = ({ title, description, action }: PageHeaderProps) => (
  <div className="flex items-start justify-between">
    <div className="flex flex-col gap-0.5">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description && (
        <p className="text-sm text-slate-500">{description}</p>
      )}
    </div>
    {action && <div>{action}</div>}
  </div>
)
