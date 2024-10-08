import { AuthWorkflows } from "@app/workflows/auth.workflows"
import { SchemaWorkflows } from "@app/workflows/schema.workflows"
import { UserWorkflows } from "@app/workflows/user.workflow"
import { AuthDomainService } from "@domain/services/auth.domain-service"
import { UserDomainService } from "@domain/services/user.domain-service"
import { AuthTokenServiceProvider } from "@infra/auth-token"
import { DbModule } from "@infra/db"
import { EmailServProvider } from "@infra/email"
import { PinoAppLoggerModule } from "@infra/logger"
import { HashingServiceProvider } from "@infra/pwhashing"
import { Global, Module } from "@nestjs/common"

// Stuff like Redit, Elasticsearch
const BASE_SERVICES = [
  HashingServiceProvider,
  AuthTokenServiceProvider,
  EmailServProvider,
]

@Global() //decorator making the module go global
@Module({
  imports: [
    PinoAppLoggerModule,
    // LoggerModule.forRoot({
    // 	pinoHttp: {
    // 		level: config.app.LOG_LEVEL,
    // 		// enabled: config.app.LOG_ENABLED,
    // 	},
    // 	exclude: ["/health"], // paths to exclude from req/resp logs
    // }),
  ],
  providers: BASE_SERVICES,
  exports: BASE_SERVICES,
})
export class BaseDiModule {}

//domain service modl

const DOMAIN_SERVICES = [AuthDomainService, UserDomainService]
@Global()
@Module({
  imports: [DbModule, BaseDiModule],
  providers: DOMAIN_SERVICES,
  exports: DOMAIN_SERVICES,
})
class DomainServicesModule {}

//app servic module
const APP_SERVICES = []

@Global()
@Module({
  imports: [DbModule, BaseDiModule, DomainServicesModule],
  providers: APP_SERVICES,
  exports: APP_SERVICES,
})
class AppServiceModule {}

//workflow module
const WORKFLOWS = [AuthWorkflows, UserWorkflows, SchemaWorkflows]

@Global()
@Module({
  imports: [BaseDiModule, AppServiceModule],
  providers: WORKFLOWS,
  exports: WORKFLOWS,
})
class WorkflowModule {}

//root module/app module //not globallll
@Module({
  imports: [BaseDiModule, AppServiceModule, WorkflowModule],
})
export class AppModule {}
