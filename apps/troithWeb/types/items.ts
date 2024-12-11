import { Item, Tax, Uom } from '@prisma/client'

export type ItemType = Item & {
  uom: Uom,
  tax: Tax
}
