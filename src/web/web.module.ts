import { AppModule } from "@infra/di";
import { type MiddlewareConsumer, Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth/auth.controller";
import { HealthController } from "./controllers/health.controller";

@Module({
	imports: [AppModule],
	providers: [],
	controllers: [HealthController, AuthController],
})
export class WebModule {
	configure(consumer: MiddlewareConsumer) {}
}
