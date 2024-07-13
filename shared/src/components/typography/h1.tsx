import { ComponentProps } from 'react'

export function H1({ className, children, ...propsToFwd }: ComponentProps<'h1'>) {
  return (
    <h1 {...propsToFwd} className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}>
      {children}
    </h1>
  )
}
