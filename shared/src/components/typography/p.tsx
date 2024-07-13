import { ComponentProps } from 'react'

export function P({ className, children, ...propsToFwd }: ComponentProps<'p'>) {
  return (
    <h1 {...propsToFwd} className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}>
      {children}
    </h1>
  )
}
