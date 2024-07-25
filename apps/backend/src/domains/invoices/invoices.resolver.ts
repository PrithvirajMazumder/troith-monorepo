import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { InvoicesService } from '@/domains/invoices/invoices.service'
import { Invoice, InvoiceItem } from '@/domains/invoices/entities/invoice.entity'
import { CreateInvoiceInput } from '@/domains/invoices/dto/create-invoice.input'
import { UpdateInvoiceInput } from '@/domains/invoices/dto/update-invoice.input'
import { Company } from '@/domains/companies/entities/company.entity'
import { CompaniesService } from '@/domains/companies/companies.service'
import { Tax } from '@/domains/taxes/entities/tax.entity'
import { BanksService } from '@/domains/banks/banks.service'
import { TaxesService } from '@/domains/taxes/taxes.service'
import { Bank } from '@/domains/banks/entities/bank.entity'
import { ItemsService } from '@/domains/items/items.service'
import { PartiesService } from '@/domains/parties/parties.service'
import { Party } from '@/domains/parties/entities/party.entity'

@Resolver(() => Invoice)
export class InvoicesResolver {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly companiesService: CompaniesService,
    private readonly banksService: BanksService,
    private readonly taxesService: TaxesService,
    private readonly itemsService: ItemsService,
    private readonly partiesService: PartiesService
  ) {}

  @Mutation(() => Invoice)
  createInvoice(@Args('createInvoiceInput') createInvoiceInput: CreateInvoiceInput) {
    return this.invoicesService.create(createInvoiceInput)
  }

  @Query(() => [Invoice], { name: 'invoices' })
  findAllByCompanyId(@Args('companyId') companyId: string) {
    return this.invoicesService.findAllByCompanyId(companyId)
  }

  @Query(() => Invoice, { name: 'invoice' })
  findOne(@Args('id') id: string) {
    return this.invoicesService.findOne(id)
  }

  @Mutation(() => Invoice)
  updateInvoice(@Args('updateInvoiceInput') updateInvoiceInput: UpdateInvoiceInput) {
    return this.invoicesService.update(updateInvoiceInput.id, updateInvoiceInput)
  }

  @Mutation(() => Invoice)
  removeInvoice(@Args('id') id: string) {
    return this.invoicesService.remove(id)
  }

  @ResolveField('company', () => Company, { nullable: true })
  getCompany(@Parent() invoice: Invoice) {
    const { companyId } = invoice
    return this.companiesService.findOne(companyId)
  }

  @ResolveField('party', () => Party)
  getParty(@Parent() invoice: Invoice) {
    const { partyId } = invoice
    return this.partiesService.findOne(partyId)
  }

  @ResolveField('tax', () => Tax, { nullable: true })
  getTax(@Parent() invoice: Invoice) {
    const { taxId } = invoice
    return this.taxesService.findOne(taxId)
  }

  @ResolveField('bank', () => Bank, {nullable: true})
  getBank(@Parent() invoice: Invoice) {
    const { bankId } = invoice
    return this.banksService.findOne(bankId)
  }

  @ResolveField('invoiceItems', () => [InvoiceItem])
  async getInvoiceItems(@Parent() invoice: Invoice) {
    const { invoiceItems } = invoice
    const itemIds = invoiceItems.map((invoiceItem) => invoiceItem.itemId)
    const items = await this.itemsService.findItemsByIds(itemIds)
    return invoiceItems.map(({ price, quantity, itemId }, index) => ({
      price,
      quantity,
      item: items[index] as unknown,
      itemId
    }))
  }
}
