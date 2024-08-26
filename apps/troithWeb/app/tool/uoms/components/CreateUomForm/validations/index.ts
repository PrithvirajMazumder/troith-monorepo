import { InferType, object, string } from 'yup'

export const CreateUomValidationSchema = object().shape({
  name: string().required('Without a name an UOM cannot be created'),
  abbreviation: string()
    .required('An abbreviation is required to easily identify an uom easily')
    .max(8, 'You abbreviation is way to long')
    .min(1, 'An abbreviation is required to easily identify an uom easily')
})

export type CreateUomFormFields = InferType<typeof CreateUomValidationSchema>
