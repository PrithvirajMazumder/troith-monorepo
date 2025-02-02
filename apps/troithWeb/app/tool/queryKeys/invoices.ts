export const invoicesKeys = {
  all: ['invoices'] as const,
  lists: (companyId: string) => [...invoicesKeys.all, 'lists', companyId] as const,
  details: () => [...invoicesKeys.all, 'detail'] as const,
  detail: (id: string) => [...invoicesKeys.details(), id] as const,
  byNo: (no: number) => [no, ...invoicesKeys.details(), 'byInvoiceNo'] as const,
  nextNo: (companyId: string) => [...invoicesKeys.all, 'nextNo', companyId]
}
