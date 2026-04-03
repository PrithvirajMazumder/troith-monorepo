'use client'
import { Input, ScrollArea } from '@troith/shared'
import { PropsWithChildren, useCallback, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next-nprogress-bar'

type Props = PropsWithChildren

export default function PartiesLayout({ children }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')

  const updateSearch = useCallback(
    (value: string) => {
      setSearchValue(value)
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set('search', value)
      } else {
        params.delete('search')
      }
      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [searchParams, router]
  )

  return (
    <div className="h-full w-full relative">
      <header className="border-b px-4 h-16 flex items-center gap-2">
        <Input
          className="h-8 w-6xl shadow-sm"
          placeholder="Filter Parties"
          value={searchValue}
          onChange={(e) => updateSearch(e.target.value)}
        />
      </header>
      <ScrollArea className="px-4 pt-4 pb-20 h-full w-full relative">{children}</ScrollArea>
    </div>
  )
}
