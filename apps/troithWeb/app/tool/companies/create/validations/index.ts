import { InferType, number, object, string } from 'yup'

export const CompanyFormValidationSchema = object().shape({
  name: string().required('Company name is required.'),
  legalName: string().required('Legal name is required.'),
  tagLine: string().optional().nullable(),
  phone: string().required('Phone number is required.').min(10, 'Phone number must be at least 10 digits.'),
  email: string().required('Email is required.').email('Please enter a valid email address.'),
  addressLine1: string().required('Address line 1 is required.'),
  addressLine2: string().optional().nullable(),
  city: string().required('City is required.'),
  state: string().required('State is required.'),
  zipCode: number().typeError('Invalid zip code.').required('Zip code is required.').positive('Zip code must be positive.'),
  gstin: string().required('GSTIN is required.').length(15, 'GSTIN must be exactly 15 characters.')
})

export type CompanyFormFields = InferType<typeof CompanyFormValidationSchema>
