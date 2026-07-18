'use client'
import { InvoiceCard, InvoiceSkeletonLoader } from '@troithWeb/app/tool/components/invoiceCard'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button, buttonVariants } from '@troith/shared'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { getFinancialYear } from '@troithWeb/utils/financialYear'
import { InvoiceType } from '@troithWeb/types/invoices'
import { useQuery } from '@tanstack/react-query'
import { invoicesKeys } from '@troithWeb/app/tool/queryKeys/invoices'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next-nprogress-bar'

interface PaginatedInvoicesResponse {
  invoices: InvoiceType[]
  total: number
}

const fetchInvoices = async (
  companyId: string,
  params: { search: string; status: string; financialYear: string; page: number; limit: number }
): Promise<PaginatedInvoicesResponse> => {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  if (params.status) searchParams.set('status', params.status)
  if (params.financialYear) searchParams.set('financialYear', params.financialYear)
  searchParams.set('page', String(params.page))
  searchParams.set('limit', String(params.limit))
  return await (await fetch(`/api/invoices/company/${companyId}?${searchParams.toString()}`)).json()
}

export default function Invoices() {
  const { selectedCompany } = useCompanyStore()
  const searchParams = useSearchParams()
  const router = useRouter()

  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const financialYear = searchParams.get('fy') || getFinancialYear(new Date())
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = parseInt(searchParams.get('limit') || '20', 10) || 20

  const { data, isLoading } = useQuery({
    queryKey: invoicesKeys.lists(selectedCompany?.id ?? '', { search, status, financialYear, page, limit }),
    queryFn: () => fetchInvoices(selectedCompany?.id ?? '', { search, status, financialYear, page, limit }),
    enabled: !!selectedCompany?.id
  })

  const invoices = data?.invoices ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  return (
    <AnimatePresence>
      <Link
        href="/tool/invoices/create"
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-20 right-4', buttonVariants({ variant: 'default' }))}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create invoice
      </Link>
      <motion.div {...animateBasicMotionOpacity()} className="flex flex-col w-full gap-4 pb-24">
        {isLoading ? (
          <>
            <InvoiceSkeletonLoader />
            <InvoiceSkeletonLoader />
            <InvoiceSkeletonLoader />
            <InvoiceSkeletonLoader />
          </>
        ) : invoices.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">No invoices found</div>
        ) : (
          invoices.map((invoice) => <InvoiceCard invoice={invoice} key={`invoice-list-${invoice?.id}-${invoice?.status}`} />)
        )}
        {!isLoading && total > 0 && (
          <div className="flex items-center justify-between pt-2 pb-4 px-1">
            <span className="text-xs text-muted-foreground">
              {total} invoice{total !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-7 w-7" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button variant="outline" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
