'use client'
import { useCreateInvoice } from '@troithWeb/app/tool/invoices/create/stores/createInvoice.store'
import { H3 } from '@troith/shared'
import { generateInvoicePdf } from '@troithWeb/app/tool/invoices/utils/generateInvoice'
import { useEffect, useState } from 'react'

export default function PreviewCreateInvoicePage() {
  const { createdInvoice } = useCreateInvoice()
  const [pdfBase64, setPdfBase64] = useState<string>('')

  useEffect(() => {
    if (createdInvoice) {
      const tCreatedPdf = generateInvoicePdf(createdInvoice)
      tCreatedPdf.getBase64((base64) => {
        setPdfBase64(pdfBase64)
      })
    }
  }, [createdInvoice])

  return (
    <>
      <H3>Preview Invoice: {createdInvoice?.no}</H3>
    </>
  )
}
