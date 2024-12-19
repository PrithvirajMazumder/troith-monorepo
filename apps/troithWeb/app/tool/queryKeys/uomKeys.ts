export const uomKeys = {
  all: ['uom'] as const,
  lists: (userId: string) => [...uomKeys.all, 'lists', userId] as const,
  details: () => [...uomKeys.all, 'detail'] as const,
  detail: (id: string) => [...uomKeys.details(), id] as const,
}
