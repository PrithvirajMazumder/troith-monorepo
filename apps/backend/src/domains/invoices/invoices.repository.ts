import { Injectable } from '@nestjs/common'
import { EntityRepository } from '@/db/entity.repository'
import { Invoice, InvoiceDocument } from '@/domains/invoices/schemas/invoice.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class InvoicesRepository extends EntityRepository<InvoiceDocument> {
  constructor(@InjectModel(Invoice.name) invoiceModel: Model<InvoiceDocument>) {
    super(invoiceModel)
  }
}
