import { AppModule } from "@infra/di";
import { type MiddlewareConsumer, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthController } from "./controllers/auth/auth.controller";
import { FileController } from "./controllers/file.controller";
import { HealthController } from "./controllers/health.controller";
import { UserController } from "./controllers/user/user.controller";
import { AuthGuard } from "./utils/guards/auth.guard";

@Module({
	imports: [AppModule],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
	controllers: [
		HealthController,
		AuthController,
		UserController,
		FileController,
	],
})
export class WebModule {
	configure(consumer: MiddlewareConsumer) {}
}
