import { gql } from '@troithWeb/__generated__'

export const ItemQueries = {
  itemsByCompanyId: gql(`query GetItems($companyId: String!) {
  items(companyId: $companyId) {
    id
    name
    hsn
    uom {
      id
      abbreviation
      name
    }
  }
}`),
  itemsByIds: gql(`query ItemsByIds($ids: [String!]!) {
  itemsByIds(items: { ids: $ids }) {
    id
    name
    hsn
    uom {
      id
      abbreviation
      name
    }
  }
}`)
}
