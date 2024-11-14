import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { InvoiceRepository } from '@troithWeb/repositories/invoice.repository'

export async function POST(req: NextRequest) {
  try {
    const invoiceData: Prisma.InvoiceCreateInput = await req.json()
    const newInvoice = await InvoiceRepository().create({
      no: 1,
      companyId: '658db32a6cf334fc362c9cad',
      partyId: 'cm3ht2ytg000414cz5ea55mwx',
      taxId: '658de4371653ad0407d29d7a',
      vehicleNumber: '',
      date: '2024-02-26T18:30:00.000Z',
      bankId: '658daf5db7894c3d678c37b3',
      status: 'PAID',
      shouldUseIgst: false
    })

    return NextResponse.json(newInvoice, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: 'Unable to create invoice' }, { status: 500 })
  }
}
