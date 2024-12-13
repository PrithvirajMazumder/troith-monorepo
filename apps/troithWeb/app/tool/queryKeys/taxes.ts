export const taxesKeys = {
  all: ['taxes'] as const,
  lists: (companyId: string) => [...taxesKeys.all, 'lists', companyId] as const,
  details: () => [...taxesKeys.all, 'detail'] as const,
  detail: (id: string) => [...taxesKeys.details(), id] as const,
}
