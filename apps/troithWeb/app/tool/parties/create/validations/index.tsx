import { InferType, number, object, string } from 'yup'

export const CreatePartySchema = object().shape({
  name: string().required('Without a party name it will be impossible to create a party'),
  addressLine1: string().required('Address line 1 cannot be empty'),
  addressLine2: string().optional().nullable(),
  zipCode: number().required('Enter a valid zip code').typeError('Enter a valid zip code'),
  state: string().required('State is required to create a party'),
  city: string().required('City is required to create a party'),
  gstin: string()
    .required('GSTIN is mandatory to create a party')
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
      message: 'Please enter a valid GSTIN'
    })
})

export type CreatePartyFormFields = InferType<typeof CreatePartySchema>
