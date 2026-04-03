import { TableFilterParams } from './items'

export const taxesKeys = {
  all: ['taxes'] as const,
  lists: (companyId: string, filters?: TableFilterParams) => [...taxesKeys.all, 'lists', companyId, filters ?? {}] as const,
  details: () => [...taxesKeys.all, 'detail'] as const,
  detail: (id: string) => [...taxesKeys.details(), id] as const
}
