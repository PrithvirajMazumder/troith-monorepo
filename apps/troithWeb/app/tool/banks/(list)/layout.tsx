'use client'
import { PropsWithChildren } from 'react'

type Props = PropsWithChildren

export default function BanksLayout(props: Props) {
  return <div className="h-full w-full relative">{props.children}</div>
}
