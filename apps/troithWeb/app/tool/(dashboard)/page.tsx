'use client'
import { DashboardQueries } from '@troithWeb/app/tool/(dashboard)/queries/dashboardQueries'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, H1, H4 } from '@troith/shared'
import { convertAmountToInr } from '@troithWeb/utils/currency'
import { InvoiceCountChart } from '@troithWeb/app/tool/(dashboard)/components/InvoiceCountChart'
import { useLazyQuery } from '@apollo/client'

export default function DashboardPage() {
  const [fetchInvoicesCountByDateRange, { loading: invoicesCountByDateRangeLoading, data: invoicesCountByDateRangeData }] = useLazyQuery(
    DashboardQueries.invoicesCountByDateRange
  )

  useEffect(() => {
    void fetchInvoicesCountByDateRange({
      variables: {
        monthsFromStart: 3,
        endingDate: new Date().toISOString()
      }
    })
  }, [])

  return (
    <div className="w-full p-4">
      <div className="mt-4 mb-6 flex items-start gap-4">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-4 w-full">
        {invoicesCountByDateRangeLoading ? (
          <p>Loading</p>
        ) : invoicesCountByDateRangeData ? (
          <InvoiceCountChart
            invoicesAndChallansCountData={invoicesCountByDateRangeData?.invoiceCountByDateRange?.map((invoicesCount) => ({
              invoices: invoicesCount.count,
              challans: invoicesCount.count,
              date: invoicesCount.date
            }))}
          />
        ) : null}
      </div>
    </div>
  )
}
