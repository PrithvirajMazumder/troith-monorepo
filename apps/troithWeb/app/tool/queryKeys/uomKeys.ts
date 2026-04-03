import { TableFilterParams } from './items'

export const uomKeys = {
  all: ['uom'] as const,
  lists: (companyId: string, filters?: TableFilterParams) => [...uomKeys.all, 'lists', companyId, filters ?? {}] as const,
  details: () => [...uomKeys.all, 'detail'] as const,
  detail: (id: string) => [...uomKeys.details(), id] as const
}
