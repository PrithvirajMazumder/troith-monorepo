'use client'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next-nprogress-bar'
import { useSession } from 'next-auth/react'
import { useSearchParams, useParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useDebounce } from '@troith/shared'
import { companiesKeys } from '@troithWeb/app/tool/queryKeys/companies'
import { TableFilterParams } from '@troithWeb/app/tool/queryKeys/items'
import { DataTable } from '@troithWeb/app/tool/components/data-table/data-table'
import { getCompanyColumns } from './columns'

interface PaginatedResponse {
  data: Array<{ id: string; name: string; legalName: string; gstin: string; state: string; city: string }>
  total: number
}

const fetchCompanies = async (userId: string, params: TableFilterParams): Promise<PaginatedResponse> => {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  searchParams.set('page', String(params.page ?? 1))
  searchParams.set('limit', String(params.limit ?? 20))
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
  return await (await fetch(`/api/companies/${userId}?${searchParams.toString()}`)).json()
}

export default function CompaniesPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const routeParams = useParams()

  const search = searchParams.get('search') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = parseInt(searchParams.get('limit') || '20', 10) || 20
  const sortBy = searchParams.get('sortBy') || 'name'
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

  const [searchValue, setSearchValue] = useState(search)
  const debouncedSearch = useDebounce(searchValue, 300)

  const filters: TableFilterParams = { search: String(debouncedSearch) || undefined, page, limit, sortBy, sortOrder }

  const { data, isLoading } = useQuery({
    queryKey: companiesKeys.lists(session?.user?.id ?? '', filters),
    queryFn: () => fetchCompanies(session?.user?.id ?? '', filters),
    enabled: !!session?.user?.id
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

  const activeCompanyId = routeParams?.id as string | undefined
  const columns = getCompanyColumns(sortBy, sortOrder, handleSortChange)

  return (
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
      onRowClick={(company) => router.push(`/tool/companies/${company.id}`)}
      activeRowId={activeCompanyId}
      searchPlaceholder="Search companies..."
    />
  )
}
