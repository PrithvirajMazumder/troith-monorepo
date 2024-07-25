import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { environment } from '@/configs/environment'
import * as dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder()
    .setTitle('Theme Provider Service Api Document')
    .setDescription(
      'This service provides functionality to save employer specific theme configs regarding styling and branding'
    )
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: '*'
  })
  await app.listen(environment.port)
  console.log('The application is running on: ', await app.getUrl())
}

void bootstrap()
