import { InferType, object, string } from 'yup'

export const CreateItemValidationSchema = object().shape({
  name: string().required("You can't create an item without a name").max(100, 'Too long item name'),
  hsn: string()
    .typeError('Please enter a valid hsn code')
    .required('Every item should have a hsn code')
    .max(6, "Length of hsn code can't be more than 6 digits")
    .min(4, "Length of hsn code can't be less than 4 digits"),
  uom: string().required('Unit of measurement is required to create an item'),
  tax: string().required('You have to select a taxation to create an item')
})

export type CreateItemValidationFormFields = InferType<typeof CreateItemValidationSchema>
