import { FinaliseInvoiceFormFields } from '@troithWeb/app/tool/invoices/create/finalize-invoice/validations'
import { Bank, Tax } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCreateInvoice } from '@troithWeb/app/tool/invoices/create/stores/createInvoice.store'
import { createNewInvoice } from '@troithWeb/app/tool/invoices/create/finalize-invoice/apis'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { useRouter } from 'next-nprogress-bar'
import { useToast } from '@troith/shared/hooks/use-toast'
import { invoicesKeys } from '@troithWeb/app/tool/queryKeys/invoices'
import { formatISO, parse } from 'date-fns'

export const useFinalizeInvoice = () => {
  const { selectedCompany } = useCompanyStore()
  const { selectedParty, invoiceItems, setCreatedInvoice } = useCreateInvoice()
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const createInvoice = async (
    finalInvoiceData: FinaliseInvoiceFormFields & {
      selectedTax: Tax
      selectedBank: Bank
    }
  ) => {
    return await createNewInvoice({
      // @ts-expect-error we have to convert BigInt to string because of serialization issue
      invoiceItems: invoiceItems?.map((invoiceItem) => ({
        quantity: invoiceItem.quantity.toString(),
        price: invoiceItem.price,
        isPriceTotal: false,
        itemId: invoiceItem?.item?.id
      })),
      bankId: finalInvoiceData.selectedBank?.id ?? '',
      companyId: selectedCompany?.id ?? '',
      date: formatISO(parse(finalInvoiceData.date, 'dd/MM/yyyy', new Date())),
      no: finalInvoiceData.invoiceNumber,
      partyId: selectedParty?.id ?? '',
      shouldUseIgst: finalInvoiceData.shouldUseIgst,
      status: 'DRAFT',
      taxId: finalInvoiceData?.selectedTax?.id,
      vehicleNumber: finalInvoiceData?.vehicleNumber ?? ''
    })
  }

  const {
    mutate,
    data: newInvoice,
    error: invoiceCreationHasError
  } = useMutation({
    mutationFn: createInvoice,
    onSuccess: (newInvoiceData) => {
      setCreatedInvoice(newInvoiceData)
      void queryClient.invalidateQueries({
        queryKey: invoicesKeys.lists(selectedCompany?.id ?? '')
      })
      router.push(
        `/tool/invoices/${newInvoiceData?.id}`,
        {},
        {
          showProgressBar: true
        }
      )
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong!',
        description: "Seems like this invoice can't be created right now."
      })
    }
  })

  return {
    createInvoice: mutate,
    newInvoice,
    invoiceCreationHasError
  }
}
