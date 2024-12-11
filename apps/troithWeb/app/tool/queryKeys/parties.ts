export const partiesKeys = {
  all: ['parties'] as const,
  lists: (companyId: string) => [...partiesKeys.all, 'lists', companyId] as const,
  details: () => [...partiesKeys.all, 'detail'] as const,
  detail: (id: string) => [...partiesKeys.details(), id] as const
}
