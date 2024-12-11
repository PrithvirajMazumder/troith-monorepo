export const itemsKeys = {
  all: ['items'] as const,
  lists: (companyId: string) => [...itemsKeys.all, 'lists', companyId] as const,
  details: () => [...itemsKeys.all, 'detail'] as const,
  detail: (id: string) => [...itemsKeys.details(), id] as const,
}
