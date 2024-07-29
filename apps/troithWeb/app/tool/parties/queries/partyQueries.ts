import { gql } from '@troithWeb/__generated__'

export const PartyQueries = {
  partiesByCompanyId: gql(`query GetParties($companyId: String!) {
  parties(companyId: $companyId) {
    id
    name
    gstin
    state
    partyItemIds
    company {
      legalName
    }
  }
}`)
}
