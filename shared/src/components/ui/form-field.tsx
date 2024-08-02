import { ComponentProps, ReactNode } from 'react'
import { cn } from '@troith/shared/lib/util'
import { Label } from '@troith/shared'

export type FormFieldProps = {
  label?: string
  labelClassName?: string
  hintClassName?: string
  hasError?: boolean
  hint?: string
  children: ReactNode
  htmlFor?: string
} & Omit<ComponentProps<'div'>, 'children'>

export const FormField = ({
  hintClassName,
  labelClassName,
  hint,
  label,
  hasError = false,
  htmlFor,
  className,
  children,
  ...propsToFwd
}: FormFieldProps) => {
  return (
    <div className={cn('flex flex-col gap-2 w-full', className)} {...propsToFwd}>
      {Boolean(label?.length) && (
        <Label htmlFor={htmlFor} className={cn('ml-1', { 'cursor-pointer': htmlFor?.length }, labelClassName, { 'text-destructive': hasError })}>
          {label}
        </Label>
      )}
      {children}
      {Boolean(hint?.length) && <p className={cn('text-sm ml-1 text-muted-foreground', hintClassName, { 'text-destructive': hasError })}>{hint}</p>}
    </div>
  )
}
