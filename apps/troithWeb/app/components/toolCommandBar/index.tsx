'use client'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@troith/shared'
import { Home, NotebookText, Pyramid, ScrollText, UsersRound } from 'lucide-react'
import { useRouter } from 'next-nprogress-bar'
import { usePathname } from 'next/navigation'

type Props = {
  shouldOpen: boolean
  onOpenChange?: (shouldOpen: boolean) => void
}

export const ToolCommandBar = ({ shouldOpen, onOpenChange }: Props) => {
  const router = useRouter()
  const pathname = usePathname()

  const handleRouting = (url: string) =>
    router.push(
      url,
      {},
      {
        showProgressBar: true
      }
    )

  return (
    <CommandDialog open={shouldOpen} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem
            defaultChecked={pathname.includes('/tool/')}
            onSelect={(value) => {
              handleRouting('/tool/')
              onOpenChange && onOpenChange(false)
            }}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem
            defaultChecked={pathname.includes('/tool/invoices')}
            onSelect={() => {
              handleRouting('/tool/invoices')
              onOpenChange && onOpenChange(false)
            }}
          >
            <ScrollText className="mr-2 h-4 w-4" />
            <span>Invoices</span>
          </CommandItem>
          <CommandItem
            defaultChecked={pathname.includes('/tool/challans')}
            onSelect={() => {
              handleRouting('/tool/challans')
              onOpenChange && onOpenChange(false)
            }}
          >
            <NotebookText className="mr-2 h-4 w-4" />
            <span>Challans</span>
          </CommandItem>
          <CommandItem
            defaultChecked={pathname.includes('/tool/items')}
            onSelect={() => {
              handleRouting('/tool/items')
              onOpenChange && onOpenChange(false)
            }}
          >
            <Pyramid className="mr-2 h-4 w-4" />
            <span>Items</span>
          </CommandItem>
          <CommandItem
            defaultChecked={pathname.includes('/tool/parties')}
            onSelect={() => {
              handleRouting('/tool/parties')
              onOpenChange && onOpenChange(false)
            }}
          >
            <UsersRound className="mr-2 h-4 w-4" />
            <span>Parties</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
