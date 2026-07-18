export interface InvoiceFilterParams {
  search?: string
  status?: string
  financialYear?: string
  page?: number
  limit?: number
}

export const invoicesKeys = {
  all: ['invoices'] as const,
  lists: (companyId: string, filters?: InvoiceFilterParams) => [...invoicesKeys.all, 'lists', companyId, filters ?? {}] as const,
  details: () => [...invoicesKeys.all, 'detail'] as const,
  detail: (id: string) => [...invoicesKeys.details(), id] as const,
  byNo: (no: number, companyId: string, financialYear: string) => [no, companyId, financialYear, ...invoicesKeys.details(), 'byInvoiceNo'] as const,
  nextNo: (companyId: string, financialYear: string) => [...invoicesKeys.all, 'nextNo', companyId, financialYear],
  financialYears: (companyId: string) => [...invoicesKeys.all, 'financialYears', companyId] as const
}
