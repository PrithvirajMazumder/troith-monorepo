import { gql } from '@troithWeb/__generated__'

export const UomMutations = {
  create: gql(`mutation CreateUom(
      $abbreviation: String!
      $name: String!
      $companyId: String!
    ) {
    createUom(createUomInput:{
      abbreviation: $abbreviation
      name: $name
      companyId: $companyId
    }) {
      id
    }
  }`)
} as const
