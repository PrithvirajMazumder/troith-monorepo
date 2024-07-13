import { ComponentProps } from 'react'

export function Blockquote({ className, children, ...propsToFwd }: ComponentProps<'blockquote'>) {
  return (
    <blockquote {...propsToFwd} className={`mt-6 border-l-2 pl-6 italic ${className}`}>
      {children}
    </blockquote>
  )
}
