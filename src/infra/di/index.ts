import { AuthWorkflows } from "@app/workflows/auth.workflows";
import { UserWorkflows } from "@app/workflows/user.workflow";
import { AuthDomainService } from "@domain/services/auth.domain-service";
import { AuthTokenServiceProvider } from "@infra/auth-token";
import { DbModule } from "@infra/db";
import { EmailServProvider } from "@infra/email";
import { PinoAppLoggerModule } from "@infra/logger";
import { HashingServiceProvider } from "@infra/pwhashing";
import { Global, Module } from "@nestjs/common";

// Stuff like Redit, Elasticsearch
const BASE_SERVICES = [
	HashingServiceProvider,
	AuthTokenServiceProvider,
	EmailServProvider,
];

@Global()
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

const DOMAIN_SERVICES = [AuthDomainService];
@Global()
@Module({
	imports: [DbModule, BaseDiModule],
	providers: DOMAIN_SERVICES,
	exports: DOMAIN_SERVICES,
})
class DomainServicesModule {}

const APP_SERVICES = [];

@Global()
@Module({
	imports: [DbModule, BaseDiModule, DomainServicesModule],
	providers: APP_SERVICES,
	exports: APP_SERVICES,
})
class AppServiceModule {}

const WORKFLOWS = [AuthWorkflows, UserWorkflows];

@Global()
@Module({
	imports: [BaseDiModule, AppServiceModule],
	providers: WORKFLOWS,
	exports: WORKFLOWS,
})
class WorkflowModule {}

@Module({
	imports: [BaseDiModule, AppServiceModule, WorkflowModule],
})
export class AppModule {}
