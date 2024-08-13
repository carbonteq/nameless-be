import { Logger as AppLogger } from "@carbonteq/hexapp"
import { Global, Module, type Provider, Scope } from "@nestjs/common"
import { PinoAppLogger } from "./pino.logger"

export const AppLoggerProvider: Provider<AppLogger> = {
  provide: AppLogger,
  useFactory: () => PinoAppLogger.createLogger(),
  scope: Scope.TRANSIENT,
}

export { PinoAppLogger }

@Global()
@Module({
  providers: [AppLoggerProvider],
  exports: [AppLoggerProvider],
})
export class PinoAppLoggerModule {}
