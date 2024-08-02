import { gql } from '@troithWeb/__generated__'

export const TaxQueries = {
  all: gql(`query GetTaxes {
    taxes {
      id
      sgst
      cgst
    }
  }`)
} as const
