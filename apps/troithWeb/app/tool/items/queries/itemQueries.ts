import { gql } from '@troithWeb/__generated__'

export const ItemQueries = {
  all: gql(`query GetItems($companyId: String!) {
  items(companyId: $companyId) {
    id
    name
    hsn
    company {
      id
      name
    }
    tax {
      id
      cgst
      sgst
    }
    uom {
      id
      name
      abbreviation
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
