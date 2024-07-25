import * as dotenv from 'dotenv'
import * as process from 'process'

dotenv.config()

export const environment = {
  nodeEnv: process.env.NODE_ENV as 'development' | 'production' | 'test' | 'provision',
  port: parseInt(process.env.PORT, 10) || 6700,
  mongo: {
    host: process.env.MONGO_HOST,
    port: parseInt(process.env.MONGO_PORT, 10) || 27017,
    name: process.env.MONGO_DATABASE_NAME,
    userName: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD
  }
}
