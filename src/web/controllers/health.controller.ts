import { Controller, Get } from "@nestjs/common";
import { Public } from "@web/utils/decorators/public.decorator";

@Public()
@Controller("/health")
export class HealthController {
	@Get("/")
	async validateEmail() {
		return { up: true };
	}
}
