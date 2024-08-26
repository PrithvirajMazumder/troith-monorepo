import { gql } from '@troithWeb/__generated__'

export const ItemMutations = {
  create: gql(`mutation CreateItem(
      $name: String!
      $hsn: Float!
      $companyId: String!
      $taxId: String!
      $uomId: String!
    ) {
    createItem(
      createItemInput: {
        name: $name
        hsn: $hsn
        companyId: $companyId
        taxId: $taxId
        uomId: $uomId
      }
    ) {
      id
    }
  }`)
} as const
