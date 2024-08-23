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
    "query GetCompanies($userId: String!) {\n    companies(userId: $userId){\n      id\n      name\n      legalName\n      city\n      state\n      addressLine1\n      addressLine2\n      gstin\n      zipCode\n    }\n  }": types.GetCompaniesDocument,
    "query GetIndianStates {\n    indianStates {\n      displayName\n      value\n    }\n  }": types.GetIndianStatesDocument,
    "query GetTaxes {\n    taxes {\n      id\n      sgst\n      cgst\n    }\n  }": types.GetTaxesDocument,
    "query GetCompanyUoms($companyId: String!) {\n  companyUoms(companyId: $companyId) {\n    id\n    abbreviation\n    name\n  }\n}": types.GetCompanyUomsDocument,
    "mutation CreateInvoice(\n  $date: String!\n  $invoiceItems: [CreateInvoiceItemInput!]!\n  $partyId: String!\n  $vehicleNumber: String!\n  $companyId: String!\n  $taxId: String!\n  $no: Int!\n  $bankId: String!\n) {\n  createInvoice(\n    createInvoiceInput: {\n      date: $date\n      invoiceItems: $invoiceItems\n      partyId: $partyId\n      vehicleNumber: $vehicleNumber\n      companyId: $companyId\n      taxId: $taxId\n      no: $no\n      bankId: $bankId\n    }\n  ) {\n    id\n    date\n    invoiceItems {\n      quantity\n      item {\n        id\n        name\n        hsn\n        tax {\n          id\n          cgst\n          sgst\n        }\n        uom {\n          id\n          abbreviation\n          name\n        }\n      }\n      price\n    }\n    party {\n      id\n      addressLine1\n      addressLine2\n      zipCode\n      name\n      state\n      gstin\n      city\n    }\n    vehicleNumber\n    company{\n      id\n      name\n      legalName\n      city\n      state\n      addressLine1\n      addressLine2\n      gstin\n    }\n    tax {\n      id\n      cgst\n      sgst\n    }\n    bank {\n      id\n      accountNumber\n      branch\n      name\n      ifsc\n    }\n    status\n    no\n  }\n}": types.CreateInvoiceDocument,
    "mutation UpdateInvoiceStatus(\n  $id: String!\n  $status: InvoiceStatus!\n) {\n  updateInvoice(\n    updateInvoiceInput: {\n      id: $id\n      status: $status\n    }\n  ) {\n    id\n    status\n  }\n}": types.UpdateInvoiceStatusDocument,
    "query\n  GetInvoices ($companyId: String!) {\n      invoices(companyId: $companyId){\n          id\n          date\n          status\n          party{\n              name\n          }\n          invoiceItems{\n              quantity\n              price\n          }\n          no\n          vehicleNumber\n      }\n  }": types.GetInvoicesDocument,
    "\n      query GetInvoice($invoiceId: String!) {\n          invoice(id: $invoiceId) {\n              id\n              date\n              shouldUseIgst\n              invoiceItems {\n                  quantity\n                  item {\n                      id\n                      name\n                      hsn\n                      tax{\n                          cgst\n                          sgst\n                      }\n                      uom{\n                          abbreviation\n                          name\n                      }\n                  }\n                  price\n              }\n              party{\n                  id\n                  addressLine1\n                  addressLine2\n                  zipCode\n                  name\n                  state\n                  gstin\n                  city\n                  partyItemIds\n              }\n              vehicleNumber\n              company{\n                  legalName\n                  city\n                  state\n                  addressLine1\n                  addressLine2\n                  zipCode\n                  gstin\n              }\n              tax{\n                  cgst\n                  sgst\n              }\n              no\n              bank{\n                  id\n                  accountNumber\n                  branch\n                  name\n                  ifsc\n              }\n              status\n          }\n      }": types.GetInvoiceDocument,
    "query GetNextInvoiceNumber { suggestedNextInvoiceNumber }": types.GetNextInvoiceNumberDocument,
    "query GetInvoiceNumberWithNo ($no: String!) {\n    invoiceByNo(no: $no){\n      no\n    }\n  }": types.GetInvoiceNumberWithNoDocument,
    "mutation CreateItem(\n      $name: String!\n      $hsn: Float!\n      $companyId: String!\n      $taxId: String!\n      $uomId: String!\n    ) {\n    createItem(\n      createItemInput: {\n        name: $name\n        hsn: $hsn\n        companyId: $companyId\n        taxId: $taxId\n        uomId: $uomId\n      }\n    ) {\n      id\n    }\n  }": types.CreateItemDocument,
    "query GetItems($companyId: String!) {\n  items(companyId: $companyId) {\n    id\n    name\n    hsn\n    company {\n      id\n      name\n    }\n    tax {\n      id\n      cgst\n      sgst\n    }\n    uom {\n      id\n      name\n      abbreviation\n    }\n  }\n}": types.GetItemsDocument,
    "query ItemsByIds($ids: [String!]!) {\n  itemsByIds(items: { ids: $ids }) {\n    id\n    name\n    hsn\n    uom {\n      id\n      abbreviation\n      name\n    }\n  }\n}": types.ItemsByIdsDocument,
    "mutation CreateParty(\n      $name: String!\n      $addressLine1: String!\n      $addressLine2: String!\n      $zipCode: Int!\n      $state: String!\n      $city: String!\n      $companyId: String!\n      $gstin: String!\n      $partyItemIds: [String!]!\n    ) {\n      createParty(createPartyInput: {\n        name: $name\n        addressLine1: $addressLine1\n        addressLine2: $addressLine2\n        zipCode: $zipCode\n        state: $state\n        city: $city\n        companyId: $companyId\n        gstin: $gstin\n        partyItemIds: $partyItemIds\n      }) {\n        id\n      }\n  }": types.CreatePartyDocument,
    "query GetParties($companyId: String!) {\n  parties(companyId: $companyId) {\n    id\n    name\n    gstin\n    state\n    partyItemIds\n    company {\n      legalName\n    }\n  }\n}": types.GetPartiesDocument,
    "query GetUoms($companyId: String!) {\n    companyUoms(companyId: $companyId) {\n      id\n      abbreviation\n      name\n    }\n  }": types.GetUomsDocument,
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
export function gql(source: "query GetCompanies($userId: String!) {\n    companies(userId: $userId){\n      id\n      name\n      legalName\n      city\n      state\n      addressLine1\n      addressLine2\n      gstin\n      zipCode\n    }\n  }"): (typeof documents)["query GetCompanies($userId: String!) {\n    companies(userId: $userId){\n      id\n      name\n      legalName\n      city\n      state\n      addressLine1\n      addressLine2\n      gstin\n      zipCode\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetIndianStates {\n    indianStates {\n      displayName\n      value\n    }\n  }"): (typeof documents)["query GetIndianStates {\n    indianStates {\n      displayName\n      value\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetTaxes {\n    taxes {\n      id\n      sgst\n      cgst\n    }\n  }"): (typeof documents)["query GetTaxes {\n    taxes {\n      id\n      sgst\n      cgst\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetCompanyUoms($companyId: String!) {\n  companyUoms(companyId: $companyId) {\n    id\n    abbreviation\n    name\n  }\n}"): (typeof documents)["query GetCompanyUoms($companyId: String!) {\n  companyUoms(companyId: $companyId) {\n    id\n    abbreviation\n    name\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation CreateInvoice(\n  $date: String!\n  $invoiceItems: [CreateInvoiceItemInput!]!\n  $partyId: String!\n  $vehicleNumber: String!\n  $companyId: String!\n  $taxId: String!\n  $no: Int!\n  $bankId: String!\n) {\n  createInvoice(\n    createInvoiceInput: {\n      date: $date\n      invoiceItems: $invoiceItems\n      partyId: $partyId\n      vehicleNumber: $vehicleNumber\n      companyId: $companyId\n      taxId: $taxId\n      no: $no\n      bankId: $bankId\n    }\n  ) {\n    id\n    date\n    invoiceItems {\n      quantity\n      item {\n        id\n        name\n        hsn\n        tax {\n          id\n          cgst\n          sgst\n        }\n        uom {\n          id\n          abbreviation\n          name\n        }\n      }\n      price\n    }\n    party {\n      id\n      addressLine1\n      addressLine2\n      zipCode\n      name\n      state\n      gstin\n      city\n    }\n    vehicleNumber\n    company{\n      id\n      name\n      legalName\n      city\n      state\n      addressLine1\n      addressLine2\n      gstin\n    }\n    tax {\n      id\n      cgst\n      sgst\n    }\n    bank {\n      id\n      accountNumber\n      branch\n      name\n      ifsc\n    }\n    status\n    no\n  }\n}"): (typeof documents)["mutation CreateInvoice(\n  $date: String!\n  $invoiceItems: [CreateInvoiceItemInput!]!\n  $partyId: String!\n  $vehicleNumber: String!\n  $companyId: String!\n  $taxId: String!\n  $no: Int!\n  $bankId: String!\n) {\n  createInvoice(\n    createInvoiceInput: {\n      date: $date\n      invoiceItems: $invoiceItems\n      partyId: $partyId\n      vehicleNumber: $vehicleNumber\n      companyId: $companyId\n      taxId: $taxId\n      no: $no\n      bankId: $bankId\n    }\n  ) {\n    id\n    date\n    invoiceItems {\n      quantity\n      item {\n        id\n        name\n        hsn\n        tax {\n          id\n          cgst\n          sgst\n        }\n        uom {\n          id\n          abbreviation\n          name\n        }\n      }\n      price\n    }\n    party {\n      id\n      addressLine1\n      addressLine2\n      zipCode\n      name\n      state\n      gstin\n      city\n    }\n    vehicleNumber\n    company{\n      id\n      name\n      legalName\n      city\n      state\n      addressLine1\n      addressLine2\n      gstin\n    }\n    tax {\n      id\n      cgst\n      sgst\n    }\n    bank {\n      id\n      accountNumber\n      branch\n      name\n      ifsc\n    }\n    status\n    no\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation UpdateInvoiceStatus(\n  $id: String!\n  $status: InvoiceStatus!\n) {\n  updateInvoice(\n    updateInvoiceInput: {\n      id: $id\n      status: $status\n    }\n  ) {\n    id\n    status\n  }\n}"): (typeof documents)["mutation UpdateInvoiceStatus(\n  $id: String!\n  $status: InvoiceStatus!\n) {\n  updateInvoice(\n    updateInvoiceInput: {\n      id: $id\n      status: $status\n    }\n  ) {\n    id\n    status\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query\n  GetInvoices ($companyId: String!) {\n      invoices(companyId: $companyId){\n          id\n          date\n          status\n          party{\n              name\n          }\n          invoiceItems{\n              quantity\n              price\n          }\n          no\n          vehicleNumber\n      }\n  }"): (typeof documents)["query\n  GetInvoices ($companyId: String!) {\n      invoices(companyId: $companyId){\n          id\n          date\n          status\n          party{\n              name\n          }\n          invoiceItems{\n              quantity\n              price\n          }\n          no\n          vehicleNumber\n      }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n      query GetInvoice($invoiceId: String!) {\n          invoice(id: $invoiceId) {\n              id\n              date\n              shouldUseIgst\n              invoiceItems {\n                  quantity\n                  item {\n                      id\n                      name\n                      hsn\n                      tax{\n                          cgst\n                          sgst\n                      }\n                      uom{\n                          abbreviation\n                          name\n                      }\n                  }\n                  price\n              }\n              party{\n                  id\n                  addressLine1\n                  addressLine2\n                  zipCode\n                  name\n                  state\n                  gstin\n                  city\n                  partyItemIds\n              }\n              vehicleNumber\n              company{\n                  legalName\n                  city\n                  state\n                  addressLine1\n                  addressLine2\n                  zipCode\n                  gstin\n              }\n              tax{\n                  cgst\n                  sgst\n              }\n              no\n              bank{\n                  id\n                  accountNumber\n                  branch\n                  name\n                  ifsc\n              }\n              status\n          }\n      }"): (typeof documents)["\n      query GetInvoice($invoiceId: String!) {\n          invoice(id: $invoiceId) {\n              id\n              date\n              shouldUseIgst\n              invoiceItems {\n                  quantity\n                  item {\n                      id\n                      name\n                      hsn\n                      tax{\n                          cgst\n                          sgst\n                      }\n                      uom{\n                          abbreviation\n                          name\n                      }\n                  }\n                  price\n              }\n              party{\n                  id\n                  addressLine1\n                  addressLine2\n                  zipCode\n                  name\n                  state\n                  gstin\n                  city\n                  partyItemIds\n              }\n              vehicleNumber\n              company{\n                  legalName\n                  city\n                  state\n                  addressLine1\n                  addressLine2\n                  zipCode\n                  gstin\n              }\n              tax{\n                  cgst\n                  sgst\n              }\n              no\n              bank{\n                  id\n                  accountNumber\n                  branch\n                  name\n                  ifsc\n              }\n              status\n          }\n      }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetNextInvoiceNumber { suggestedNextInvoiceNumber }"): (typeof documents)["query GetNextInvoiceNumber { suggestedNextInvoiceNumber }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetInvoiceNumberWithNo ($no: String!) {\n    invoiceByNo(no: $no){\n      no\n    }\n  }"): (typeof documents)["query GetInvoiceNumberWithNo ($no: String!) {\n    invoiceByNo(no: $no){\n      no\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation CreateItem(\n      $name: String!\n      $hsn: Float!\n      $companyId: String!\n      $taxId: String!\n      $uomId: String!\n    ) {\n    createItem(\n      createItemInput: {\n        name: $name\n        hsn: $hsn\n        companyId: $companyId\n        taxId: $taxId\n        uomId: $uomId\n      }\n    ) {\n      id\n    }\n  }"): (typeof documents)["mutation CreateItem(\n      $name: String!\n      $hsn: Float!\n      $companyId: String!\n      $taxId: String!\n      $uomId: String!\n    ) {\n    createItem(\n      createItemInput: {\n        name: $name\n        hsn: $hsn\n        companyId: $companyId\n        taxId: $taxId\n        uomId: $uomId\n      }\n    ) {\n      id\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetItems($companyId: String!) {\n  items(companyId: $companyId) {\n    id\n    name\n    hsn\n    company {\n      id\n      name\n    }\n    tax {\n      id\n      cgst\n      sgst\n    }\n    uom {\n      id\n      name\n      abbreviation\n    }\n  }\n}"): (typeof documents)["query GetItems($companyId: String!) {\n  items(companyId: $companyId) {\n    id\n    name\n    hsn\n    company {\n      id\n      name\n    }\n    tax {\n      id\n      cgst\n      sgst\n    }\n    uom {\n      id\n      name\n      abbreviation\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query ItemsByIds($ids: [String!]!) {\n  itemsByIds(items: { ids: $ids }) {\n    id\n    name\n    hsn\n    uom {\n      id\n      abbreviation\n      name\n    }\n  }\n}"): (typeof documents)["query ItemsByIds($ids: [String!]!) {\n  itemsByIds(items: { ids: $ids }) {\n    id\n    name\n    hsn\n    uom {\n      id\n      abbreviation\n      name\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation CreateParty(\n      $name: String!\n      $addressLine1: String!\n      $addressLine2: String!\n      $zipCode: Int!\n      $state: String!\n      $city: String!\n      $companyId: String!\n      $gstin: String!\n      $partyItemIds: [String!]!\n    ) {\n      createParty(createPartyInput: {\n        name: $name\n        addressLine1: $addressLine1\n        addressLine2: $addressLine2\n        zipCode: $zipCode\n        state: $state\n        city: $city\n        companyId: $companyId\n        gstin: $gstin\n        partyItemIds: $partyItemIds\n      }) {\n        id\n      }\n  }"): (typeof documents)["mutation CreateParty(\n      $name: String!\n      $addressLine1: String!\n      $addressLine2: String!\n      $zipCode: Int!\n      $state: String!\n      $city: String!\n      $companyId: String!\n      $gstin: String!\n      $partyItemIds: [String!]!\n    ) {\n      createParty(createPartyInput: {\n        name: $name\n        addressLine1: $addressLine1\n        addressLine2: $addressLine2\n        zipCode: $zipCode\n        state: $state\n        city: $city\n        companyId: $companyId\n        gstin: $gstin\n        partyItemIds: $partyItemIds\n      }) {\n        id\n      }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetParties($companyId: String!) {\n  parties(companyId: $companyId) {\n    id\n    name\n    gstin\n    state\n    partyItemIds\n    company {\n      legalName\n    }\n  }\n}"): (typeof documents)["query GetParties($companyId: String!) {\n  parties(companyId: $companyId) {\n    id\n    name\n    gstin\n    state\n    partyItemIds\n    company {\n      legalName\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetUoms($companyId: String!) {\n    companyUoms(companyId: $companyId) {\n      id\n      abbreviation\n      name\n    }\n  }"): (typeof documents)["query GetUoms($companyId: String!) {\n    companyUoms(companyId: $companyId) {\n      id\n      abbreviation\n      name\n    }\n  }"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;