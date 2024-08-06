import { InvoiceItem } from '@troithWeb/__generated__/graphql'
import { convertAmountToInr } from '@troithWeb/utils/currency'

export const CreateInvoiceSidePanelInvoiceItemList = ({ invoiceItem }: { invoiceItem: InvoiceItem }) => (
  <div className="mb-2 w-full">
    <p className="font-semibold capitalize">{invoiceItem?.item?.name}</p>
    <div className="flex justify-between items-center flex-wrap w-full">
      <p className="text-sm text-muted-foreground italic capitalize">
        {invoiceItem?.quantity}
        {invoiceItem?.item?.uom.abbreviation} X {convertAmountToInr(invoiceItem?.price).replace('.00', '')}
      </p>
      <p className="text-sm text-muted-foreground italic capitalize font-semibold">
        {convertAmountToInr(invoiceItem?.price * invoiceItem?.quantity)}
      </p>
    </div>
  </div>
)
