'use client'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { buttonVariants } from '@troith/shared'
import { Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { useRouter } from 'next-nprogress-bar'
import { useSearchParams, useParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useDebounce } from '@troith/shared'
import { taxesKeys } from '@troithWeb/app/tool/queryKeys/taxes'
import { TableFilterParams } from '@troithWeb/app/tool/queryKeys/items'
import { DataTable } from '@troithWeb/app/tool/components/data-table/data-table'
import { getTaxColumns } from './columns'

interface PaginatedResponse {
  data: Array<{ id: string; cgst: number; sgst: number }>
  total: number
}

const fetchTaxes = async (companyId: string, params: TableFilterParams): Promise<PaginatedResponse> => {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  searchParams.set('page', String(params.page ?? 1))
  searchParams.set('limit', String(params.limit ?? 20))
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
  return await (await fetch(`/api/taxes/company/${companyId}?${searchParams.toString()}`)).json()
}

export default function TaxesPage() {
  const { selectedCompany } = useCompanyStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const routeParams = useParams()

  const search = searchParams.get('search') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = parseInt(searchParams.get('limit') || '20', 10) || 20
  const sortBy = searchParams.get('sortBy') || 'cgst'
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

  const [searchValue, setSearchValue] = useState(search)
  const debouncedSearch = useDebounce(searchValue, 300)

  const filters: TableFilterParams = { search: String(debouncedSearch) || undefined, page, limit, sortBy, sortOrder }

  const { data, isLoading } = useQuery({
    queryKey: taxesKeys.lists(selectedCompany?.id ?? '', filters),
    queryFn: () => fetchTaxes(selectedCompany?.id ?? '', filters),
    enabled: !!selectedCompany?.id
  })

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
      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [searchParams, router]
  )

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    updateParams({ search: value, page: '1' })
  }

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) })
  }

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    updateParams({ sortBy: newSortBy, sortOrder: newSortOrder, page: '1' })
  }

  const activeTaxId = routeParams?.id as string | undefined
  const columns = getTaxColumns(sortBy, sortOrder, handleSortChange)

  return (
    <>
      <Link
        href="/tool/taxes/create"
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-4 right-4 z-10', buttonVariants({ variant: 'default' }))}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create tax
      </Link>
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        total={data?.total ?? 0}
        page={page}
        limit={limit}
        isLoading={isLoading}
        searchValue={searchValue}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onRowClick={(tax) => router.push(`/tool/taxes/${tax.id}`)}
        activeRowId={activeTaxId}
        searchPlaceholder="Search taxes..."
      />
    </>
  )
}
