export const banksKeys = {
  all: ['banks'] as const,
  lists: (userId: string) => [...banksKeys.all, 'lists', userId] as const,
  details: () => [...banksKeys.all, 'detail'] as const,
  detail: (id: string) => [...banksKeys.details(), id] as const,
}
