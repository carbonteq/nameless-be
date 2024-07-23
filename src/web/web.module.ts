import { AppModule } from "@infra/di";
import { type MiddlewareConsumer, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthController } from "./controllers/auth/auth.controller";
import { HealthController } from "./controllers/health.controller";
import { AuthGuard } from "./utils/guards/auth.guard";

@Module({
	imports: [AppModule],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
	controllers: [HealthController, AuthController],
})
export class WebModule {
	configure(consumer: MiddlewareConsumer) {}
}
