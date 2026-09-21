import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import { json, urlencoded } from 'express'
import { AppModule } from './app.module'
import { corsMiddleware } from './common/middleware/cors.middleware'

process.env.TZ = process.env.TZ ?? 'Asia/Manila'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false })

  app.use(corsMiddleware())
  app.use(json({ limit: '8mb' }))
  app.use(urlencoded({ extended: true, limit: '8mb' }))
  app.use(cookieParser())
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
}
bootstrap()
