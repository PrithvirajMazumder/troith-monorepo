/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Bank = {
  __typename?: 'Bank';
  accountNumber: Scalars['Int']['output'];
  branch: Scalars['String']['output'];
  id: Scalars['String']['output'];
  ifsc: Scalars['String']['output'];
  name: Scalars['String']['output'];
  user?: Maybe<User>;
};

export type Challan = {
  __typename?: 'Challan';
  /** Example field (placeholder) */
  exampleField: Scalars['Int']['output'];
};

export type Company = {
  __typename?: 'Company';
  addressLine1: Scalars['String']['output'];
  addressLine2?: Maybe<Scalars['String']['output']>;
  bank: Bank;
  city: Scalars['String']['output'];
  gstin: Scalars['String']['output'];
  id: Scalars['String']['output'];
  legalName: Scalars['String']['output'];
  name: Scalars['String']['output'];
  state: Scalars['String']['output'];
  totalGrossChallanAmount?: Maybe<Scalars['Int']['output']>;
  totalGrossInvoiceAmount?: Maybe<Scalars['Int']['output']>;
  totalNetChallanAmount?: Maybe<Scalars['Int']['output']>;
  totalNetInvoiceAmount?: Maybe<Scalars['Int']['output']>;
  user: User;
  zipCode: Scalars['Float']['output'];
};

export type CreateBankInput = {
  accountNumber: Scalars['Int']['input'];
  branch: Scalars['String']['input'];
  ifsc: Scalars['String']['input'];
  name: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type CreateChallanInput = {
  /** Example field (placeholder) */
  exampleField: Scalars['Int']['input'];
};

export type CreateCompanyInput = {
  addressLine1: Scalars['String']['input'];
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  bankId: Scalars['String']['input'];
  city: Scalars['String']['input'];
  gstin: Scalars['String']['input'];
  legalName: Scalars['String']['input'];
  name: Scalars['String']['input'];
  state: Scalars['String']['input'];
  userId: Scalars['String']['input'];
  zipCode: Scalars['Float']['input'];
};

export type CreateInvoiceInput = {
  bankId: Scalars['String']['input'];
  companyId: Scalars['String']['input'];
  date: Scalars['String']['input'];
  invoiceItems: Array<CreateInvoiceItemInput>;
  no: Scalars['String']['input'];
  partyId: Scalars['String']['input'];
  taxId: Scalars['String']['input'];
  vehicleNumber: Scalars['String']['input'];
};

export type CreateInvoiceItemInput = {
  itemId: Scalars['String']['input'];
  price: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
};

export type CreateItemInput = {
  companyId: Scalars['String']['input'];
  hsn?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  taxId: Scalars['String']['input'];
  uomId: Scalars['String']['input'];
};

export type CreatePartyInput = {
  addressLine1: Scalars['String']['input'];
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  companyId: Scalars['String']['input'];
  gstin: Scalars['String']['input'];
  name: Scalars['String']['input'];
  partyItemIds: Array<Scalars['String']['input']>;
  state: Scalars['String']['input'];
  zipCode: Scalars['Int']['input'];
};

export type CreateTaxInput = {
  cgst: Scalars['Int']['input'];
  sgst: Scalars['Int']['input'];
};

export type CreateUomInput = {
  abbreviation: Scalars['String']['input'];
  companyId: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['Int']['input']>;
};

export type Invoice = {
  __typename?: 'Invoice';
  bank?: Maybe<Bank>;
  company?: Maybe<Company>;
  date: Scalars['String']['output'];
  id: Scalars['String']['output'];
  invoiceItems: Array<InvoiceItem>;
  no: Scalars['String']['output'];
  party: Party;
  status: InvoiceStatus;
  tax?: Maybe<Tax>;
  vehicleNumber?: Maybe<Scalars['String']['output']>;
};

export type InvoiceItem = {
  __typename?: 'InvoiceItem';
  item?: Maybe<Item>;
  price: Scalars['Int']['output'];
  quantity: Scalars['Int']['output'];
};

export enum InvoiceStatus {
  Confirmed = 'Confirmed',
  Draft = 'Draft',
  Paid = 'Paid'
}

export type Item = {
  __typename?: 'Item';
  company?: Maybe<Company>;
  hsn?: Maybe<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  tax: Tax;
  uom: Uom;
};

export type Mutation = {
  __typename?: 'Mutation';
  createBank: Bank;
  createChallan: Challan;
  createCompany: Company;
  createInvoice: Invoice;
  createItem: Item;
  createParty: Party;
  createTax: Tax;
  createUom: Uom;
  createUser: User;
  removeBank: Bank;
  removeChallan: Challan;
  removeCompany: Company;
  removeInvoice: Invoice;
  removeItem: Item;
  removeParty: Party;
  removeTax: Tax;
  removeUom: Uom;
  removeUser: User;
  updateBank: Bank;
  updateChallan: Challan;
  updateCompany: Company;
  updateInvoice: Invoice;
  updateItem: Item;
  updateParty: Party;
  updateTax: Tax;
  updateUom: Uom;
  updateUser: User;
};


export type MutationCreateBankArgs = {
  createBankInput: CreateBankInput;
};


export type MutationCreateChallanArgs = {
  createChallanInput: CreateChallanInput;
};


export type MutationCreateCompanyArgs = {
  createCompanyInput: CreateCompanyInput;
};


export type MutationCreateInvoiceArgs = {
  createInvoiceInput: CreateInvoiceInput;
};


export type MutationCreateItemArgs = {
  createItemInput: CreateItemInput;
};


export type MutationCreatePartyArgs = {
  createPartyInput: CreatePartyInput;
};


export type MutationCreateTaxArgs = {
  createTaxInput: CreateTaxInput;
};


export type MutationCreateUomArgs = {
  createUomInput: CreateUomInput;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationRemoveBankArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveChallanArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveCompanyArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveInvoiceArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveItemArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemovePartyArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveTaxArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveUomArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateBankArgs = {
  updateBankInput: UpdateBankInput;
};


export type MutationUpdateChallanArgs = {
  updateChallanInput: UpdateChallanInput;
};


export type MutationUpdateCompanyArgs = {
  updateCompanyInput: UpdateCompanyInput;
};


export type MutationUpdateInvoiceArgs = {
  updateInvoiceInput: UpdateInvoiceInput;
};


export type MutationUpdateItemArgs = {
  updateItemInput: UpdateItemInput;
};


export type MutationUpdatePartyArgs = {
  updatePartyInput: UpdatePartyInput;
};


export type MutationUpdateTaxArgs = {
  updateTaxInput: UpdateTaxInput;
};


export type MutationUpdateUomArgs = {
  updateUomInput: UpdateUomInput;
};


export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type Party = {
  __typename?: 'Party';
  addressLine1?: Maybe<Scalars['String']['output']>;
  addressLine2?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Company>;
  gstin?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  partyItemIds?: Maybe<Array<Scalars['String']['output']>>;
  state?: Maybe<Scalars['String']['output']>;
  zipCode?: Maybe<Scalars['Int']['output']>;
};

export type Query = {
  __typename?: 'Query';
  bank: Bank;
  banks: Array<Bank>;
  challan: Challan;
  challans: Array<Challan>;
  companies: Array<Company>;
  company: Company;
  companyUoms: Array<Uom>;
  invoice: Invoice;
  invoiceByNo: Invoice;
  invoices: Array<Invoice>;
  item: Item;
  items: Array<Item>;
  itemsByIds: Array<Item>;
  parties: Array<Party>;
  party: Party;
  suggestedNextInvoiceNumber: Scalars['Float']['output'];
  tax: Tax;
  taxes: Array<Tax>;
  uom: Uom;
  uoms: Array<Uom>;
  user: User;
  users: Array<User>;
};


export type QueryBankArgs = {
  id: Scalars['String']['input'];
};


export type QueryChallanArgs = {
  id: Scalars['Int']['input'];
};


export type QueryCompaniesArgs = {
  userId: Scalars['String']['input'];
};


export type QueryCompanyArgs = {
  id: Scalars['String']['input'];
};


export type QueryCompanyUomsArgs = {
  companyId: Scalars['String']['input'];
};


export type QueryInvoiceArgs = {
  id: Scalars['String']['input'];
};


export type QueryInvoiceByNoArgs = {
  no: Scalars['String']['input'];
};


export type QueryInvoicesArgs = {
  companyId: Scalars['String']['input'];
};


export type QueryItemArgs = {
  id: Scalars['String']['input'];
};


export type QueryItemsArgs = {
  companyId: Scalars['String']['input'];
};


export type QueryItemsByIdsArgs = {
  items: StringArrayInput;
};


export type QueryPartiesArgs = {
  companyId: Scalars['String']['input'];
};


export type QueryPartyArgs = {
  id: Scalars['String']['input'];
};


export type QueryTaxArgs = {
  id: Scalars['String']['input'];
};


export type QueryUomArgs = {
  id: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};

export type StringArrayInput = {
  ids: Array<Scalars['String']['input']>;
};

export type Tax = {
  __typename?: 'Tax';
  cgst: Scalars['Int']['output'];
  id?: Maybe<Scalars['String']['output']>;
  sgst: Scalars['Int']['output'];
};

export type Uom = {
  __typename?: 'Uom';
  abbreviation: Scalars['String']['output'];
  company?: Maybe<Company>;
  id?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type UpdateBankInput = {
  accountNumber?: InputMaybe<Scalars['Int']['input']>;
  branch?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  ifsc?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateChallanInput = {
  /** Example field (placeholder) */
  exampleField?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
};

export type UpdateCompanyInput = {
  addressLine1?: InputMaybe<Scalars['String']['input']>;
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  bankId?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  gstin?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  legalName?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  totalGrossChallanAmount?: InputMaybe<Scalars['Int']['input']>;
  totalGrossInvoiceAmount?: InputMaybe<Scalars['Int']['input']>;
  totalNetChallanAmount?: InputMaybe<Scalars['Int']['input']>;
  totalNetInvoiceAmount?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateInvoiceInput = {
  bankId?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  invoiceItems?: InputMaybe<Array<CreateInvoiceItemInput>>;
  no?: InputMaybe<Scalars['String']['input']>;
  partyId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<InvoiceStatus>;
  taxId?: InputMaybe<Scalars['String']['input']>;
  vehicleNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateItemInput = {
  hsn?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  taxId?: InputMaybe<Scalars['String']['input']>;
  uomId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePartyInput = {
  addressLine1?: InputMaybe<Scalars['String']['input']>;
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  gstin?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  partyItemIds?: InputMaybe<Array<Scalars['String']['input']>>;
  state?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateTaxInput = {
  cgst?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['String']['input'];
  sgst?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateUomInput = {
  abbreviation?: InputMaybe<Scalars['String']['input']>;
  companyId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['Int']['input']>;
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['Int']['output']>;
};

export type GetBanksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBanksQuery = { __typename?: 'Query', banks: Array<{ __typename?: 'Bank', id: string, accountNumber: number, branch: string, name: string, ifsc: string, user?: { __typename?: 'User', id: string } | null }> };

export type GetTaxesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTaxesQuery = { __typename?: 'Query', taxes: Array<{ __typename?: 'Tax', id?: string | null, sgst: number, cgst: number }> };

export type GetInvoicesQueryVariables = Exact<{
  companyId: Scalars['String']['input'];
}>;


export type GetInvoicesQuery = { __typename?: 'Query', invoices: Array<{ __typename?: 'Invoice', id: string, date: string, status: InvoiceStatus, no: string, vehicleNumber?: string | null, party: { __typename?: 'Party', name?: string | null }, invoiceItems: Array<{ __typename?: 'InvoiceItem', quantity: number, price: number }> }> };

export type GetInvoiceQueryVariables = Exact<{
  invoiceId: Scalars['String']['input'];
}>;


export type GetInvoiceQuery = { __typename?: 'Query', invoice: { __typename?: 'Invoice', id: string, date: string, vehicleNumber?: string | null, no: string, status: InvoiceStatus, invoiceItems: Array<{ __typename?: 'InvoiceItem', quantity: number, price: number, item?: { __typename?: 'Item', id: string, name: string, hsn?: number | null, tax: { __typename?: 'Tax', cgst: number, sgst: number }, uom: { __typename?: 'Uom', abbreviation: string, name: string } } | null }>, party: { __typename?: 'Party', id?: string | null, addressLine1?: string | null, addressLine2?: string | null, zipCode?: number | null, name?: string | null, state?: string | null, gstin?: string | null, city?: string | null, partyItemIds?: Array<string> | null }, company?: { __typename?: 'Company', legalName: string, city: string, state: string, addressLine1: string, addressLine2?: string | null, zipCode: number, gstin: string } | null, tax?: { __typename?: 'Tax', cgst: number, sgst: number } | null, bank?: { __typename?: 'Bank', id: string, accountNumber: number, branch: string, name: string, ifsc: string } | null } };

export type GetNextInvoiceNumberQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNextInvoiceNumberQuery = { __typename?: 'Query', suggestedNextInvoiceNumber: number };

export type GetInvoiceNumberWithNoQueryVariables = Exact<{
  no: Scalars['String']['input'];
}>;


export type GetInvoiceNumberWithNoQuery = { __typename?: 'Query', invoiceByNo: { __typename?: 'Invoice', no: string } };

export type GetItemsQueryVariables = Exact<{
  companyId: Scalars['String']['input'];
}>;


export type GetItemsQuery = { __typename?: 'Query', items: Array<{ __typename?: 'Item', id: string, name: string, hsn?: number | null, uom: { __typename?: 'Uom', id?: string | null, abbreviation: string, name: string } }> };

export type ItemsByIdsQueryVariables = Exact<{
  ids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ItemsByIdsQuery = { __typename?: 'Query', itemsByIds: Array<{ __typename?: 'Item', id: string, name: string, hsn?: number | null, uom: { __typename?: 'Uom', id?: string | null, abbreviation: string, name: string } }> };

export type GetPartiesQueryVariables = Exact<{
  companyId: Scalars['String']['input'];
}>;


export type GetPartiesQuery = { __typename?: 'Query', parties: Array<{ __typename?: 'Party', id?: string | null, name?: string | null, gstin?: string | null, state?: string | null, partyItemIds?: Array<string> | null, company?: { __typename?: 'Company', legalName: string } | null }> };


export const GetBanksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBanks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"banks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"branch"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ifsc"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetBanksQuery, GetBanksQueryVariables>;
export const GetTaxesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTaxes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taxes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sgst"}},{"kind":"Field","name":{"kind":"Name","value":"cgst"}}]}}]}}]} as unknown as DocumentNode<GetTaxesQuery, GetTaxesQueryVariables>;
export const GetInvoicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInvoices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invoices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"party"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invoiceItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"no"}},{"kind":"Field","name":{"kind":"Name","value":"vehicleNumber"}}]}}]}}]} as unknown as DocumentNode<GetInvoicesQuery, GetInvoicesQueryVariables>;
export const GetInvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInvoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoiceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoiceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"hsn"}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cgst"}},{"kind":"Field","name":{"kind":"Name","value":"sgst"}}]}},{"kind":"Field","name":{"kind":"Name","value":"uom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"party"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"gstin"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"partyItemIds"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vehicleNumber"}},{"kind":"Field","name":{"kind":"Name","value":"company"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"legalName"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"addressLine2"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"gstin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cgst"}},{"kind":"Field","name":{"kind":"Name","value":"sgst"}}]}},{"kind":"Field","name":{"kind":"Name","value":"no"}},{"kind":"Field","name":{"kind":"Name","value":"bank"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"branch"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ifsc"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetInvoiceQuery, GetInvoiceQueryVariables>;
export const GetNextInvoiceNumberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNextInvoiceNumber"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suggestedNextInvoiceNumber"}}]}}]} as unknown as DocumentNode<GetNextInvoiceNumberQuery, GetNextInvoiceNumberQueryVariables>;
export const GetInvoiceNumberWithNoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInvoiceNumberWithNo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"no"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invoiceByNo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"no"},"value":{"kind":"Variable","name":{"kind":"Name","value":"no"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"no"}}]}}]}}]} as unknown as DocumentNode<GetInvoiceNumberWithNoQuery, GetInvoiceNumberWithNoQueryVariables>;
export const GetItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"hsn"}},{"kind":"Field","name":{"kind":"Name","value":"uom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetItemsQuery, GetItemsQueryVariables>;
export const ItemsByIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ItemsByIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"itemsByIds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"items"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"hsn"}},{"kind":"Field","name":{"kind":"Name","value":"uom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ItemsByIdsQuery, ItemsByIdsQueryVariables>;
export const GetPartiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetParties"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"parties"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"companyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"companyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gstin"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"partyItemIds"}},{"kind":"Field","name":{"kind":"Name","value":"company"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"legalName"}}]}}]}}]}}]} as unknown as DocumentNode<GetPartiesQuery, GetPartiesQueryVariables>;