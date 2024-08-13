import {
  type Logger as AppLogger,
  LOG_LEVEL,
  type LogLevel,
} from "@carbonteq/hexapp"
import config from "@infra/config"
import type { LoggerService } from "@nestjs/common"
import pino, { type Logger as PinoBaseLogger } from "pino"

const createPinoLogger = (logLevel: LogLevel): PinoBaseLogger => {
  const logger = pino({
    level: logLevel,
  })

  return logger
}

export class PinoAppLogger implements AppLogger, LoggerService {
  private logger: PinoBaseLogger

  static readonly DEFAULT_LOG_LEVEL: LogLevel = config.app.LOG_LEVEL
  static readonly DEFAULT_CTX: string = "GLOBAL"
  private static readonly GLOBAL_LOGGER = createPinoLogger(
    PinoAppLogger.DEFAULT_LOG_LEVEL,
  )

  private constructor(logger: PinoBaseLogger) {
    this.logger = logger
  }

  static createLogger(): PinoAppLogger {
    const logger: PinoBaseLogger = PinoAppLogger.GLOBAL_LOGGER.child({})

    return new PinoAppLogger(logger)
  }

  setLevel(lvl: LogLevel): void {
    this.logger.level = lvl
  }

  setContext(ctx: string): void {
    this.logger.setBindings({ context: ctx }) // bindings are overwritten, resulting in duplicate keys
  }

  error(...args: unknown[]): void {
    this.logger.error(args)
  }

  warn(...args: unknown[]): void {
    this.logger.warn(args)
  }

  info(...args: unknown[]): void {
    this.logger.info(args)
  }

  debug(...args: unknown[]): void {
    this.logger.debug(args)
  }

  log(level: LogLevel, ...args: unknown[]): void {
    switch (level) {
      case LOG_LEVEL.ERROR:
        this.error(args)
        break
      case LOG_LEVEL.WARN:
        this.warn(args)
        break
      case LOG_LEVEL.INFO:
        this.info(args)
        break
      case LOG_LEVEL.DEBUG:
        this.debug(args)
        break
    }
  }
}
