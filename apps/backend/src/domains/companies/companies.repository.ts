import { Injectable } from '@nestjs/common'
import { EntityRepository } from '@/db/entity.repository'
import { Company, CompanyDocument } from '@/domains/companies/schemas/company.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class CompaniesRepository extends EntityRepository<CompanyDocument>{
  public constructor(@InjectModel(Company.name) companyModel: Model<CompanyDocument>) {
    super(companyModel)
  }
}
