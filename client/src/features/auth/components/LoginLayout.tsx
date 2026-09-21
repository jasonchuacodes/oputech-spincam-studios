import { cn } from '../../../utils/cn'

interface LoginLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function LoginLayout({
  children,
  className,
  ...props
}: LoginLayoutProps) {
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      <div
        className={cn(
          'bg-background relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto',
          className
        )}
        {...props}
      >
        <img
          src="/assets/brand/icon-512.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -left-20 hidden opacity-20 brightness-150 grayscale select-none sm:w-60 sm:block"
        />
        <img
          src="/assets/brand/icon-512.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-20 hidden -scale-x-100 opacity-20 brightness-150 grayscale select-none sm:w-60 sm:block"
        />
        {children}
      </div>
    </div>
  )
}
