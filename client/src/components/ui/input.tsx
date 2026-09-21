import * as React from 'react'
import { cn } from '@/utils/cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-border focus-visible:border-brand focus-visible:ring-brand/10 aria-invalid:border-danger aria-invalid:ring-danger/20 h-10 min-h-11 w-full min-w-0 rounded-sm border bg-white px-3 text-base transition-colors outline-none placeholder:text-slate-400 focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&:-webkit-autofill]:bg-white',
        className
      )}
      {...props}
    />
  )
}

export { Input }
