import { environment } from '@/configs/environment'
import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { LoggerMiddleware } from '@/middlewares/logger.middleware'
import { DbModule } from '@/db/db.module'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { CompaniesModule } from '@/domains/companies/companies.module'
import { BanksModule } from '@/domains/banks/banks.module'
import { UsersModule } from '@/domains/users/users.module'
import { TaxesModule } from '@/domains/taxes/taxes.module'
import { UomsModule } from '@/domains/uoms/uoms.module'
import { ItemsModule } from '@/domains/items/items.module'
import { PartiesModule } from '@/domains/parties/parties.module'
import { InvoicesModule } from '@/domains/invoices/invoices.module'
import { ChallansModule } from '@/domains/challans/challans.module'
import { join } from 'path'

@Module({
  imports: [
    DbModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: environment.nodeEnv === 'development'
    }),
    CompaniesModule,
    BanksModule,
    UsersModule,
    TaxesModule,
    UomsModule,
    ItemsModule,
    PartiesModule,
    InvoicesModule,
    ChallansModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
