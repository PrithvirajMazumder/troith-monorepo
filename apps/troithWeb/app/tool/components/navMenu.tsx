import { cn } from '@troith/shared/lib/util'
import { buttonVariants, P, Tooltip, TooltipContent, TooltipTrigger } from '@troith/shared'
import { LucideIcon } from 'lucide-react'
import Link, { LinkProps } from 'next/link'
import { ReactNode } from 'react'

export type Props = {
  icon?: LucideIcon
  children: ReactNode
  variant?: 'default' | 'ghost' | 'destructive'
  className?: string
  iconOnly?: boolean
} & Omit<LinkProps, 'icon'>

export const NavMenu = ({ children, variant = 'ghost', className, iconOnly = false, ...props }: Props) => {
  if (iconOnly) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            {...props}
            className={cn(
              buttonVariants({ variant, size: iconOnly ? 'icon' : 'sm' }),
              className,
              variant === 'default' && 'dark:bg-muted dark:text-white dark:hover:bg-muted'
            )}
          >
            {props.icon ? <props.icon className="h-5 w-5" /> : null}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <P>{children}</P>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Link
      {...props}
      className={cn(
        buttonVariants({ variant, size: 'sm' }),
        'justify-start',
        className,
        variant === 'default' && 'dark:bg-muted dark:text-white dark:hover:bg-muted'
      )}
    >
      {props.icon ? <props.icon className="mr-2 h-5 w-5" /> : null}
      {children}
    </Link>
  )
}
