import { gql } from '@troithWeb/__generated__'

export const BankQueries = {
  all: gql(`query GetBanks {
    banks {
      id
      accountNumber
      branch
      name
      ifsc
      user {
        id
      }
    }
  }`)
} as const
