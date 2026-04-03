export interface TableFilterParams {
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const itemsKeys = {
  all: ['items'] as const,
  lists: (companyId: string, filters?: TableFilterParams) => [...itemsKeys.all, 'lists', companyId, filters ?? {}] as const,
  details: () => [...itemsKeys.all, 'detail'] as const,
  detail: (id: string) => [...itemsKeys.details(), id] as const
}
