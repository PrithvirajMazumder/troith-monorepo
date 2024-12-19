import { Tax, Uom } from '@prisma/client'
import { CreateItemValidationFormFields } from '@troithWeb/app/tool/items/create/validations'

export const fetchUoms = async (userId: string): Promise<Array<Uom>> => await (await fetch(`/api/uoms/user/${userId}`)).json()
export const fetchTaxes = async (companyId: string): Promise<Array<Tax>> => await (await fetch(`/api/taxes/company/${companyId}`)).json()
export const saveItem = async (
  item: CreateItemValidationFormFields & {
    companyId: string
  }
) => {
  return await (
    await fetch('/api/items', {
      body: JSON.stringify({
        name: item.name,
        hsn: parseInt(item.hsn),
        companyId: item.companyId,
        uomId: item.uom,
        taxId: item.tax
      }),
      method: 'POST'
    })
  ).json()
}
