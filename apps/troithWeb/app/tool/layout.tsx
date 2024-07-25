'use client'
import {
  Button,
  Input,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@troith/shared/components/ui'
import { H3, P } from '@troith/shared/components/typography'
import {
  Download,
  Factory,
  Home,
  Landmark,
  LogOut,
  Moon,
  NotebookText,
  Pencil,
  Pyramid,
  ScrollText,
  Settings,
  SlidersHorizontal,
  SquarePercent,
  Sun,
  Trash,
  UsersRound
} from 'lucide-react'
import { NavMenu } from './components/navMenu'
import { useState } from 'react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'

const ToolLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { setTheme } = useTheme()
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <ResizablePanelGroup direction="horizontal" className="!h-screen border-r">
        <ResizablePanel
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
          collapsible
          maxSize={20}
          minSize={12}
          defaultSize={20}
          collapsedSize={4}
          className="h-full hidden md:block"
        >
          <div className="px-4 h-[calc(100%-4.5rem)]">
            {isCollapsed ? (
              <header className="h-16 flex items-center justify-center">
                <Tooltip delayDuration={500}>
                  <TooltipTrigger asChild>
                    <h1 className="text-3xl text-primary font-bold text-center cursor-pointer">T</h1>
                  </TooltipTrigger>
                  <TooltipContent>
                    <P>Easy invoice making tool</P>
                  </TooltipContent>
                </Tooltip>
              </header>
            ) : (
              <header className="h-16 flex items-center">
                <h1 className="text-3xl font-bold">
                  <span className="text-primary">T</span>roith
                </h1>
              </header>
            )}
            <div style={{ alignItems: isCollapsed ? 'center' : 'start' }} className="py-2 flex-col flex gap-1 h-full">
              <NavMenu variant={pathname === '/tool' ? 'default' : 'ghost'} iconOnly={isCollapsed} href="/tool" icon={Home}>
                Dashboard
              </NavMenu>
              <NavMenu variant={pathname.includes('invoices') ? 'default' : 'ghost'} iconOnly={isCollapsed} href="/tool/invoices" icon={ScrollText}>
                Invoices
              </NavMenu>
              <NavMenu variant={pathname.includes('challans') ? 'default' : 'ghost'} iconOnly={isCollapsed} href="/tool/challans" icon={NotebookText}>
                Challans
              </NavMenu>
              <NavMenu variant={pathname.includes('items') ? 'default' : 'ghost'} iconOnly={isCollapsed} href="/tool/items" icon={Pyramid}>
                Items
              </NavMenu>
              <NavMenu variant={pathname.includes('parties') ? 'default' : 'ghost'} iconOnly={isCollapsed} href="/tool/parties" icon={UsersRound}>
                Parties
              </NavMenu>
              <Separator className="my-2" />
              <NavMenu variant={pathname.includes('companies') ? 'default' : 'ghost'} iconOnly={isCollapsed} href="/tool/companies" icon={Factory}>
                Companies
              </NavMenu>
              <NavMenu variant={pathname.includes('taxes') ? 'default' : 'ghost'} iconOnly={isCollapsed} href="/tool/taxes" icon={SquarePercent}>
                Taxes
              </NavMenu>
              <NavMenu variant={pathname.includes('banks') ? 'default' : 'ghost'} iconOnly={isCollapsed} href="/tool/banks" icon={Landmark}>
                Banks
              </NavMenu>
              <NavMenu
                variant={pathname.includes('settings') ? 'default' : 'ghost'}
                iconOnly={isCollapsed}
                className="mt-auto"
                href="/tool/settings"
                icon={Settings}
              >
                Settings
              </NavMenu>
              <NavMenu
                className="flex dark:hidden transition-all duration-300"
                onClick={(event) => {
                  event.preventDefault()
                  setTheme('dark')
                }}
                iconOnly={isCollapsed}
                href="#"
                icon={Moon}
              >
                Dark mode
              </NavMenu>
              <NavMenu
                className="hidden dark:flex transition-all duration-300"
                onClick={(event) => {
                  event.preventDefault()
                  setTheme('light')
                }}
                iconOnly={isCollapsed}
                href="#"
                icon={Sun}
              >
                Light mode
              </NavMenu>
              <NavMenu iconOnly={isCollapsed} href="#" icon={LogOut}>
                Logout
              </NavMenu>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="hidden md:flex" />
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={50}>
              <header className="border-b px-4 h-16 flex items-center gap-2">
                <H3>Invoices</H3>
                <Input className="ml-auto max-w-36 w-full" placeholder="Search" />
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <P>Filters</P>
                  </TooltipContent>
                </Tooltip>
              </header>
              <ScrollArea className="p-4">
                <span className="font-semibold">Two</span>
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={30} maxSize={50}>
              <header className="border-b px-4 py-4 h-16 flex items-center">
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <P>Delete</P>
                  </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <P>Archive</P>
                  </TooltipContent>
                </Tooltip>
                <Separator orientation="vertical" className="mx-2" />
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <P>Download</P>
                  </TooltipContent>
                </Tooltip>
              </header>
              <ScrollArea className="h-full p-6">
                <span className="font-semibold">Two</span>
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}

export default ToolLayout
