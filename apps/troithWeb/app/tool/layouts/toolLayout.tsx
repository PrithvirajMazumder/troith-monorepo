'use client'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@troith/shared/components/ui'
import { P } from '@troith/shared/components/typography'
import {
  ChevronRight,
  Factory,
  Home,
  Landmark,
  LogOut,
  Moon,
  NotebookText,
  PencilRuler,
  Pyramid,
  ScrollText,
  Settings,
  SquarePercent,
  Sun,
  UsersRound
} from 'lucide-react'
import { PropsWithChildren, useState } from 'react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { ToolCommandBar } from '@troithWeb/app/components/toolCommandBar'
import { useToolCommand } from '@troithWeb/app/components/toolCommandBar/hooks/useToolCommand'
import { CompanyStoreProvider, useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { cn } from '@troith/shared/lib/util'
import { ApolloWrapper } from '@troithWeb/lib/graphqlClient'
import { CompanyCard } from '@troithWeb/app/tool/components/companyCard'
import { CustomEventsNames } from '@troithWeb/app/tool/constants/customEventsNames'
import { NavMenu } from '@troithWeb/app/tool/components/navMenu'
import { signOut } from '@troithWeb/auth'
import { Company } from '@prisma/client'

export const ToolLayout = ({ children }: PropsWithChildren) => {
  const { selectedCompany, companies, setSelectedCompany, isSelectCompanyModalOpen, toggleSelectCompanyModal } = useCompanyStore()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { shouldOpen, setShouldOpen } = useToolCommand()
  const { setTheme } = useTheme()
  const pathname = usePathname()

  const handleCompanySelection = (company: Company) => {
    setSelectedCompany(company)
    toggleSelectCompanyModal(false)
  }

  return (
    <ApolloWrapper>
      <CompanyStoreProvider>
        <TooltipProvider>
          <ToolLayout>
            <Dialog open={isSelectCompanyModalOpen} onOpenChange={toggleSelectCompanyModal}>
              <DialogPortal>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select a company</DialogTitle>
                  </DialogHeader>
                  <div className="w-full flex flex-col gap-2">
                    {companies?.map((company) => (
                      <CompanyCard entity={company} key={`select-company-list-modal-${company.id}`} onSelect={handleCompanySelection} />
                    ))}
                  </div>
                </DialogContent>
              </DialogPortal>
            </Dialog>
            <ToolCommandBar shouldOpen={shouldOpen} onOpenChange={setShouldOpen} />
            <ResizablePanelGroup autoSaveId="TOOL_ROOT_LAYOUT_REZIABLE_PANEL" direction="horizontal" className="!h-screen border-r">
              <ResizablePanel
                onResize={(size) => {
                  window.dispatchEvent(
                    new CustomEvent(CustomEventsNames.ToolSideMenuResizeEventName, {
                      detail: {
                        message: size
                      }
                    })
                  )
                }}
                onCollapse={() => {
                  setIsCollapsed(true)
                  window.dispatchEvent(
                    new CustomEvent(CustomEventsNames.ToolSideMenuResizeEventName, {
                      detail: {
                        message: 'true'
                      }
                    })
                  )
                }}
                onExpand={() => {
                  setIsCollapsed(false)
                  window.dispatchEvent(
                    new CustomEvent(CustomEventsNames.ToolSideMenuResizeEventName, {
                      detail: {
                        message: 'false'
                      }
                    })
                  )
                }}
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
                    <NavMenu
                      variant={pathname.includes('invoices') ? 'default' : 'ghost'}
                      iconOnly={isCollapsed}
                      href="/tool/invoices"
                      icon={ScrollText}
                    >
                      Invoices
                    </NavMenu>
                    <NavMenu
                      variant={pathname.includes('challans') ? 'default' : 'ghost'}
                      iconOnly={isCollapsed}
                      href="/tool/challans"
                      icon={NotebookText}
                    >
                      Challans
                    </NavMenu>
                    <NavMenu
                      variant={
                        pathname.includes('items') && !pathname.includes('choose-items') && !pathname.includes('configure-invoice-items')
                          ? 'default'
                          : 'ghost'
                      }
                      iconOnly={isCollapsed}
                      href="/tool/items"
                      icon={Pyramid}
                    >
                      Items
                    </NavMenu>
                    <NavMenu variant={pathname.includes('uoms') ? 'default' : 'ghost'} iconOnly={isCollapsed} href="/tool/uoms" icon={PencilRuler}>
                      Units
                    </NavMenu>
                    <NavMenu
                      variant={pathname.includes('parties') ? 'default' : 'ghost'}
                      iconOnly={isCollapsed}
                      href="/tool/parties"
                      icon={UsersRound}
                    >
                      Parties
                    </NavMenu>
                    <Separator className="my-2" />
                    <NavMenu
                      variant={pathname.includes('companies') ? 'default' : 'ghost'}
                      iconOnly={isCollapsed}
                      href="/tool/companies"
                      icon={Factory}
                    >
                      Companies
                    </NavMenu>
                    <NavMenu
                      variant={pathname.includes('taxes') ? 'default' : 'ghost'}
                      iconOnly={isCollapsed}
                      href="/tool/taxes"
                      icon={SquarePercent}
                    >
                      Taxes
                    </NavMenu>
                    <NavMenu variant={pathname.includes('banks') ? 'default' : 'ghost'} iconOnly={isCollapsed} href="/tool/banks" icon={Landmark}>
                      Banks
                    </NavMenu>
                    <Button
                      variant={'ghost'}
                      size={isCollapsed ? 'icon' : 'sm'}
                      className={cn('mt-auto capitalize', { 'w-full justify-start': !isCollapsed })}
                      onClick={() => toggleSelectCompanyModal(true)}
                    >
                      <div
                        className={cn(
                          'w-5 h-5 min-w-5 min-h-5 bg-foreground/60 rounded-full flex flex-col justify-center items-center text-white dark:text-black text-[10px]',
                          {
                            'mr-2': !isCollapsed
                          }
                        )}
                      >
                        {selectedCompany?.legalName?.substring(0, 2)?.toUpperCase()}
                      </div>
                      {isCollapsed ? null : selectedCompany ? selectedCompany?.name : 'Select company'}
                      {!isCollapsed ? <ChevronRight className="w-4 h-4 ml-auto" /> : null}
                    </Button>
                    <NavMenu
                      variant={pathname.includes('settings') ? 'default' : 'ghost'}
                      iconOnly={isCollapsed}
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
                    <NavMenu
                      iconOnly={isCollapsed}
                      onClick={(event) => {
                        event.preventDefault()
                        void signOut({
                          redirect: true,
                          redirectTo: '/auth'
                        })
                      }}
                      href={'/auth'}
                      icon={LogOut}
                    >
                      Logout
                    </NavMenu>
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle className="hidden md:flex" />
              <ResizablePanel defaultSize={80}>
                {selectedCompany ? (
                  children
                ) : (
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <Button onClick={() => toggleSelectCompanyModal(true)}>Select a company</Button>
                  </div>
                )}
              </ResizablePanel>
            </ResizablePanelGroup>
          </ToolLayout>
        </TooltipProvider>
      </CompanyStoreProvider>
    </ApolloWrapper>
  )
}
