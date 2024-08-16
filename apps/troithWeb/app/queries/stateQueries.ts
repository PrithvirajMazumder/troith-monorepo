import { gql } from '@troithWeb/__generated__'

export const StateQueries = {
  allIndianStates: gql(`query GetIndianStates {
    indianStates {
      displayName
      value
    }
  }`)
} as const
