import { gql } from '@troithWeb/__generated__'

export const CompanyQueries = {
  allByUserId: gql(`query GetCompanies($userId: String!) {
    companies(userId: $userId){
      id
      name
      legalName
      city
      state
      addressLine1
      addressLine2
      gstin
      zipCode
    }
  }`)
} as const
