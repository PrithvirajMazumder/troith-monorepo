import { ComponentProps } from 'react'

export function H4({ className, children, ...propsToFwd }: ComponentProps<'h4'>) {
  return (
    <h1 {...propsToFwd} className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`}>
      {children}
    </h1>
  )
}
