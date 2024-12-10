import { convertAmountToInr } from '@troithWeb/utils/currency'
import { InvoiceItemType } from '@troithWeb/types/invoices'

export const CreateInvoiceSidePanelInvoiceItemList = ({ invoiceItem }: { invoiceItem: InvoiceItemType }) => (
  <div className="mb-2 w-full">
    <p className="font-semibold capitalize">{invoiceItem?.item?.name}</p>
    <div className="flex justify-between items-center flex-wrap w-full">
      <p className="text-sm text-muted-foreground italic capitalize">
        {invoiceItem?.quantity}
        {invoiceItem?.uom?.abbreviation} X {convertAmountToInr(`${invoiceItem?.price}`).replace('.00', '')}
      </p>
      <p className="text-sm text-muted-foreground italic capitalize font-semibold">
        {convertAmountToInr(parseInt(`${invoiceItem?.price}`) * parseInt(`${invoiceItem?.quantity}`))}
      </p>
    </div>
  </div>
)
