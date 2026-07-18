'use client'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import {
  Button,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  ScrollArea,
  Checkbox
} from '@troith/shared'
import { CheckCircle, Gem, PencilLine, PlusCircle, CircleDashed, FileCheck } from 'lucide-react'
import { ResizableTwoColumnToolLayout } from '@troithWeb/app/tool/components/layouts/resizableTwoColumnToolLayout'
import { CustomEventsNames } from '@troithWeb/app/tool/constants/customEventsNames'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next-nprogress-bar'
import { useDebounce } from '@troith/shared'
import { InvoiceStatus } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { invoicesKeys } from '@troithWeb/app/tool/queryKeys/invoices'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { getFinancialYear } from '@troithWeb/utils/financialYear'
import { cn } from '@troith/shared/lib/util'

type Props = {
  children: ReactNode
  invoice: ReactNode
}

const statusOptions: { value: InvoiceStatus; label: string; icon: ReactNode }[] = [
  { value: 'DRAFT', label: 'Draft', icon: <PencilLine className="h-4 w-4" /> },
  { value: 'CONFIRMED', label: 'Confirmed', icon: <CheckCircle className="h-4 w-4" /> },
  { value: 'PAID', label: 'Paid', icon: <Gem className="h-4 w-4" /> },
  { value: 'PARTIALLY_PAID', label: 'Partially Paid', icon: <CircleDashed className="h-4 w-4" /> },
  { value: 'GST_SUBMITTED', label: 'GST Submitted', icon: <FileCheck className="h-4 w-4" /> }
]

const fetchFinancialYears = async (companyId: string): Promise<string[]> =>
  await (await fetch(`/api/invoices/company/${companyId}/financial-years`)).json()

export default function InvoicesLayout(props: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { selectedCompany } = useCompanyStore()
  const currentFy = getFinancialYear(new Date())

  const { data: financialYears } = useQuery({
    queryKey: invoicesKeys.financialYears(selectedCompany?.id ?? ''),
    queryFn: () => fetchFinancialYears(selectedCompany?.id ?? ''),
    enabled: !!selectedCompany?.id
  })

  const selectedFy = searchParams.get('fy') || currentFy

  const formatFyLabel = (fy: string) => {
    const [start, end] = fy.split('-')
    return `FY 20${start}-${end}`
  }

  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')
  const debouncedSearch = useDebounce(searchValue, 300)

  const selectedStatuses = (searchParams.get('status') || '')
    .split(',')
    .filter(Boolean) as InvoiceStatus[]

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      params.set('page', '1')
      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [searchParams, router]
  )

  useEffect(() => {
    const currentSearch = searchParams.get('search') || ''
    if (debouncedSearch !== currentSearch) {
      updateParams({ search: String(debouncedSearch) })
    }
  }, [debouncedSearch])

  const toggleStatus = (status: InvoiceStatus) => {
    const current = new Set(selectedStatuses)
    if (current.has(status)) {
      current.delete(status)
    } else {
      current.add(status)
    }
    updateParams({ status: Array.from(current).join(',') })
  }

  return (
    <ResizableTwoColumnToolLayout
      autoSaveId="INVOICE_RESIZABLE_LAYOUT_KEY"
      firstCol={
        <>
          {financialYears && financialYears.length > 0 && (
            <div className="border-b px-4 flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {(financialYears.includes(currentFy) ? financialYears : [currentFy, ...financialYears]).map((fy) => (
                <button
                  key={fy}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString())
                    params.set('fy', fy)
                    params.set('page', '1')
                    router.replace(`?${params.toString()}`, { scroll: false })
                  }}
                  className={cn(
                    'px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors',
                    selectedFy === fy
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                  )}
                >
                  {formatFyLabel(fy)}
                </button>
              ))}
            </div>
          )}
          <header className="border-b px-4 h-16 flex items-center gap-2">
            <Input
              className="h-8 w-6xl shadow-sm"
              placeholder="Filter Invoices"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="shadow-sm border-dashed h-8 border">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Status
                  {selectedStatuses.length > 0 && (
                    <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal">
                      {selectedStatuses.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    className="capitalize gap-2"
                    onSelect={(e) => {
                      e.preventDefault()
                      toggleStatus(option.value)
                    }}
                  >
                    <Checkbox checked={selectedStatuses.includes(option.value)} className="pointer-events-none" />
                    {option.icon}
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <ScrollArea className="px-4 pt-4 pb-20 h-full w-full relative">{props.children}</ScrollArea>
        </>
      }
      onResize={(size) => {
        window.dispatchEvent(
          new CustomEvent(CustomEventsNames.InvoiceSidePanelResizeEventName, {
            detail: {
              message: size
            }
          })
        )
      }}
      secondCol={props.invoice}
    />
  )
}
