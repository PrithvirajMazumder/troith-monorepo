import { TableFilterParams } from './items'

export const companiesKeys = {
  all: ['companies'] as const,
  lists: (userId: string, filters?: TableFilterParams) => [...companiesKeys.all, 'lists', userId, filters ?? {}] as const,
  details: () => [...companiesKeys.all, 'detail'] as const,
  detail: (id: string) => [...companiesKeys.details(), id] as const
}
