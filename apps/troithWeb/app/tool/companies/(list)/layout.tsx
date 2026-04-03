'use client'
import { PropsWithChildren } from 'react'

type Props = PropsWithChildren

export default function CompaniesLayout({ children }: Props) {
  return <div className="h-full w-full relative">{children}</div>
}
