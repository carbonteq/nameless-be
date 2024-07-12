import { AuthWorkflows } from "@app/workflows/auth.workflows";
import { AuthTokenServiceProvider } from "@infra/auth-token";
import { DbModule } from "@infra/db";
import { PinoAppLoggerModule } from "@infra/logger";
import { HashingServiceProvider } from "@infra/pwhashing";
import { Global, Module } from "@nestjs/common";

// Stuff like Redit, Elasticsearch
const BASE_SERVICES = [HashingServiceProvider, AuthTokenServiceProvider];

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

const APP_SERVICES = [];

@Global()
@Module({
	imports: [DbModule, BaseDiModule],
	providers: APP_SERVICES,
	exports: APP_SERVICES,
})
class AppServiceModule {}

const WORKFLOWS = [AuthWorkflows];

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
