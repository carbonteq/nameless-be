import fastifyMultipart from "@fastify/multipart"
import { PinoAppLogger } from "@infra/logger/pino.logger"
import type { INestApplication } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify"
import fastify from "fastify"
import { ErrorFilter } from "./utils/filters/error.filter"
import { ResponseInterceptor } from "./utils/interceptors/response.interceptor"
import { WebModule } from "./web.module"

const ONE_MB = 1024 * 1024

// Shared instrumentation
export const createApp = (): Promise<NestFastifyApplication> => {
  const server = fastify()
  server.register(fastifyMultipart, {
    attachFieldsToBody: true,
    limits: { files: 1, fileSize: 20 * ONE_MB },
  })
  const adapter = new FastifyAdapter(server)
  // adapter.register(plugin, pluginOpts)
  const app = NestFactory.create<NestFastifyApplication>(WebModule, adapter, {
    bufferLogs: true,
    rawBody: true,
  })
  return app
}

export const configureApp = (app: INestApplication) => {
  app.useGlobalInterceptors(
    new ResponseInterceptor(PinoAppLogger.createLogger()),
  )
  app.useGlobalFilters(new ErrorFilter(PinoAppLogger.createLogger()))
}
