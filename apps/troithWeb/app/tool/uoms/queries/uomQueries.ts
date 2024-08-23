import { gql } from '@troithWeb/__generated__'

export const UomQueries = {
  all: gql(`query GetUoms($companyId: String!) {
    companyUoms(companyId: $companyId) {
      id
      abbreviation
      name
    }
  }`)
} as const
