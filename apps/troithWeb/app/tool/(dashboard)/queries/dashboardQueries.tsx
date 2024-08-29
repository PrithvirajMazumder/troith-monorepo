import { gql } from '@troithWeb/__generated__'

export const DashboardQueries = {
  invoicesCountByDateRange: gql(`query GetInvoicesCountByDateRange (
    $endingDate: String!
    $monthsFromStart: Int!
  ) {
    invoiceCountByDateRange(invoicesCountByDateRangeInput: {
      endingDate: $endingDate
      monthsFromStart: $monthsFromStart
    }) {
      date
      count
    }
  }`)
} as const
