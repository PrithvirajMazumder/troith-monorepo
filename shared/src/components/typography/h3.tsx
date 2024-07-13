import { ComponentProps } from 'react'

export function H3({ className, children, ...propsToFwd }: ComponentProps<'h3'>) {
  return (
    <h1 {...propsToFwd} className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}>
      {children}
    </h1>
  )
}
