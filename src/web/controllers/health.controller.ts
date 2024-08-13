import { Controller, Get } from "@nestjs/common"
import { Public } from "@web/utils/decorators/public.decorator"

@Public()
@Controller("/api/health")
export class HealthController {
  @Get()
  async health() {
    return { up: true }
  }
}
