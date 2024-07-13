import { ComponentProps } from 'react'

export function H2({ className, children, ...propsToFwd }: ComponentProps<'h2'>) {
  return (
    <h1 {...propsToFwd} className={`scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className}`}>
      {children}
    </h1>
  )
}
