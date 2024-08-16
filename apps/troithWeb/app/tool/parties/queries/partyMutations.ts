import { gql } from '@troithWeb/__generated__'

export const PartyMutations = {
  create: gql(`mutation CreateParty(
      $name: String!
      $addressLine1: String!
      $addressLine2: String!
      $zipCode: Int!
      $state: String!
      $city: String!
      $companyId: String!
      $gstin: String!
      $partyItemIds: [String!]!
    ) {
      createParty(createPartyInput: {
        name: $name
        addressLine1: $addressLine1
        addressLine2: $addressLine2
        zipCode: $zipCode
        state: $state
        city: $city
        companyId: $companyId
        gstin: $gstin
        partyItemIds: $partyItemIds
      }) {
        id
      }
  }`)
} as const
