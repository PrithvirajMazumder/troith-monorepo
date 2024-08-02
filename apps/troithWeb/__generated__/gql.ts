/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "query GetBanks {\n    banks {\n      id\n      accountNumber\n      branch\n      name\n      ifsc\n      user {\n        id\n      }\n    }\n  }": types.GetBanksDocument,
    "query GetTaxes {\n    taxes {\n      id\n      sgst\n      cgst\n    }\n  }": types.GetTaxesDocument,
    "query\n  GetInvoices ($companyId: String!) {\n      invoices(companyId: $companyId){\n          id\n          date\n          status\n          party{\n              name\n          }\n          invoiceItems{\n              quantity\n              price\n          }\n          no\n          vehicleNumber\n      }\n  }": types.GetInvoicesDocument,
    "\n      query GetInvoice($invoiceId: String!) {\n          invoice(id: $invoiceId) {\n              id\n              date\n              invoiceItems {\n                  quantity\n                  item {\n                      id\n                      name\n                      hsn\n                      tax{\n                          cgst\n                          sgst\n                      }\n                      uom{\n                          abbreviation\n                          name\n                      }\n                  }\n                  price\n              }\n              party{\n                  id\n                  addressLine1\n                  addressLine2\n                  zipCode\n                  name\n                  state\n                  gstin\n                  city\n                  partyItemIds\n              }\n              vehicleNumber\n              company{\n                  legalName\n                  city\n                  state\n                  addressLine1\n                  addressLine2\n                  zipCode\n                  gstin\n              }\n              tax{\n                  cgst\n                  sgst\n              }\n              no\n              bank{\n                  id\n                  accountNumber\n                  branch\n                  name\n                  ifsc\n              }\n              status\n          }\n      }": types.GetInvoiceDocument,
    "query GetItems($companyId: String!) {\n  items(companyId: $companyId) {\n    id\n    name\n    hsn\n    uom {\n      id\n      abbreviation\n      name\n    }\n  }\n}": types.GetItemsDocument,
    "query ItemsByIds($ids: [String!]!) {\n  itemsByIds(items: { ids: $ids }) {\n    id\n    name\n    hsn\n    uom {\n      id\n      abbreviation\n      name\n    }\n  }\n}": types.ItemsByIdsDocument,
    "query GetParties($companyId: String!) {\n  parties(companyId: $companyId) {\n    id\n    name\n    gstin\n    state\n    partyItemIds\n    company {\n      legalName\n    }\n  }\n}": types.GetPartiesDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetBanks {\n    banks {\n      id\n      accountNumber\n      branch\n      name\n      ifsc\n      user {\n        id\n      }\n    }\n  }"): (typeof documents)["query GetBanks {\n    banks {\n      id\n      accountNumber\n      branch\n      name\n      ifsc\n      user {\n        id\n      }\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetTaxes {\n    taxes {\n      id\n      sgst\n      cgst\n    }\n  }"): (typeof documents)["query GetTaxes {\n    taxes {\n      id\n      sgst\n      cgst\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query\n  GetInvoices ($companyId: String!) {\n      invoices(companyId: $companyId){\n          id\n          date\n          status\n          party{\n              name\n          }\n          invoiceItems{\n              quantity\n              price\n          }\n          no\n          vehicleNumber\n      }\n  }"): (typeof documents)["query\n  GetInvoices ($companyId: String!) {\n      invoices(companyId: $companyId){\n          id\n          date\n          status\n          party{\n              name\n          }\n          invoiceItems{\n              quantity\n              price\n          }\n          no\n          vehicleNumber\n      }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query GetInvoice($invoiceId: String!) {\n          invoice(id: $invoiceId) {\n              id\n              date\n              invoiceItems {\n                  quantity\n                  item {\n                      id\n                      name\n                      hsn\n                      tax{\n                          cgst\n                          sgst\n                      }\n                      uom{\n                          abbreviation\n                          name\n                      }\n                  }\n                  price\n              }\n              party{\n                  id\n                  addressLine1\n                  addressLine2\n                  zipCode\n                  name\n                  state\n                  gstin\n                  city\n                  partyItemIds\n              }\n              vehicleNumber\n              company{\n                  legalName\n                  city\n                  state\n                  addressLine1\n                  addressLine2\n                  zipCode\n                  gstin\n              }\n              tax{\n                  cgst\n                  sgst\n              }\n              no\n              bank{\n                  id\n                  accountNumber\n                  branch\n                  name\n                  ifsc\n              }\n              status\n          }\n      }"): (typeof documents)["\n      query GetInvoice($invoiceId: String!) {\n          invoice(id: $invoiceId) {\n              id\n              date\n              invoiceItems {\n                  quantity\n                  item {\n                      id\n                      name\n                      hsn\n                      tax{\n                          cgst\n                          sgst\n                      }\n                      uom{\n                          abbreviation\n                          name\n                      }\n                  }\n                  price\n              }\n              party{\n                  id\n                  addressLine1\n                  addressLine2\n                  zipCode\n                  name\n                  state\n                  gstin\n                  city\n                  partyItemIds\n              }\n              vehicleNumber\n              company{\n                  legalName\n                  city\n                  state\n                  addressLine1\n                  addressLine2\n                  zipCode\n                  gstin\n              }\n              tax{\n                  cgst\n                  sgst\n              }\n              no\n              bank{\n                  id\n                  accountNumber\n                  branch\n                  name\n                  ifsc\n              }\n              status\n          }\n      }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetItems($companyId: String!) {\n  items(companyId: $companyId) {\n    id\n    name\n    hsn\n    uom {\n      id\n      abbreviation\n      name\n    }\n  }\n}"): (typeof documents)["query GetItems($companyId: String!) {\n  items(companyId: $companyId) {\n    id\n    name\n    hsn\n    uom {\n      id\n      abbreviation\n      name\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query ItemsByIds($ids: [String!]!) {\n  itemsByIds(items: { ids: $ids }) {\n    id\n    name\n    hsn\n    uom {\n      id\n      abbreviation\n      name\n    }\n  }\n}"): (typeof documents)["query ItemsByIds($ids: [String!]!) {\n  itemsByIds(items: { ids: $ids }) {\n    id\n    name\n    hsn\n    uom {\n      id\n      abbreviation\n      name\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetParties($companyId: String!) {\n  parties(companyId: $companyId) {\n    id\n    name\n    gstin\n    state\n    partyItemIds\n    company {\n      legalName\n    }\n  }\n}"): (typeof documents)["query GetParties($companyId: String!) {\n  parties(companyId: $companyId) {\n    id\n    name\n    gstin\n    state\n    partyItemIds\n    company {\n      legalName\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;