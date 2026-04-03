import { TableFilterParams } from './items'

export const banksKeys = {
  all: ['banks'] as const,
  lists: (userId: string, filters?: TableFilterParams) => [...banksKeys.all, 'lists', userId, filters ?? {}] as const,
  details: () => [...banksKeys.all, 'detail'] as const,
  detail: (id: string) => [...banksKeys.details(), id] as const
}
