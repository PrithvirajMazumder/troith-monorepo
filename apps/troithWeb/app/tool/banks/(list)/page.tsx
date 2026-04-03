'use client'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { buttonVariants } from '@troith/shared'
import { Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next-nprogress-bar'
import { useSession } from 'next-auth/react'
import { useSearchParams, useParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useDebounce } from '@troith/shared'
import { banksKeys } from '@troithWeb/app/tool/queryKeys/banks'
import { TableFilterParams } from '@troithWeb/app/tool/queryKeys/items'
import { DataTable } from '@troithWeb/app/tool/components/data-table/data-table'
import { getBankColumns } from './columns'

interface PaginatedResponse {
  data: Array<{ id: string; name: string; accountNumber: string; ifsc: string; branch: string; holderName: string }>
  total: number
}

const fetchBanks = async (userId: string, params: TableFilterParams): Promise<PaginatedResponse> => {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  searchParams.set('page', String(params.page ?? 1))
  searchParams.set('limit', String(params.limit ?? 20))
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
  return await (await fetch(`/api/banks/user/${userId}?${searchParams.toString()}`)).json()
}

export default function BanksPage() {
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
    queryKey: banksKeys.lists(session?.user?.id ?? '', filters),
    queryFn: () => fetchBanks(session?.user?.id ?? '', filters),
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

  const activeBankId = routeParams?.id as string | undefined
  const columns = getBankColumns(sortBy, sortOrder, handleSortChange)

  return (
    <>
      <Link
        href="/tool/banks/create"
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-4 right-4 z-10', buttonVariants({ variant: 'default' }))}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create bank
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
        onRowClick={(bank) => router.push(`/tool/banks/${bank.id}`)}
        activeRowId={activeBankId}
        searchPlaceholder="Search banks..."
      />
    </>
  )
}
