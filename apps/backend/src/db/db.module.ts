import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { environment } from '@/configs/environment'

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${environment.mongo.userName}:${environment.mongo.password}@${environment.mongo.host}:${environment.mongo.port}`,
      {
        dbName: environment.mongo.name,
        autoIndex: true,
        autoCreate: true
      }
    )
  ]
})
export class DbModule {}
