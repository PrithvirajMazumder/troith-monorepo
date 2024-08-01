import * as React from 'react'

import { cn } from '@troith/shared/lib/util'
import { ReactNode } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, icon, ...props }, ref) => {
  return (
    <div className="relative h-max w-max">
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300',
          className
        )}
        ref={ref}
        {...props}
      />
      {icon && <div className="absolute top-0 right-0 w-max h-full border-l flex items-center justify-center px-2">{icon}</div>}
    </div>
  )
})
Input.displayName = 'Input'

export { Input }
