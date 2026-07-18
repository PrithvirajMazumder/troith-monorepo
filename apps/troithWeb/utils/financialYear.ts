export function getFinancialYear(date: Date): string {
  const month = date.getMonth()
  const year = date.getFullYear()

  if (month >= 3) {
    return `${String(year).slice(-2)}-${String(year + 1).slice(-2)}`
  }
  return `${String(year - 1).slice(-2)}-${String(year).slice(-2)}`
}

export function formatInvoiceNo(no: number, financialYear: string): string {
  return `${financialYear}/${no}`
}
