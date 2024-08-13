import { SubmitSchemaDto } from "@app/dtos/validator.dto";
import { SchemaWorkflows } from "@app/workflows/schema.workflows";
import { Controller, Post, Req } from "@nestjs/common";
import { BodyDto } from "@web/utils/decorators/dto-wrapper";
import { FastifyRequest } from "fastify";

@Controller("/api/schema")
export class SchemaController {
	constructor(private readonly wfs: SchemaWorkflows) {}

	@Post()
	async saveValidationSchema(
		@Req() req: FastifyRequest,
		@BodyDto(SubmitSchemaDto) dto: SubmitSchemaDto,
	) {
		return await this.wfs.submitValidationSchema(req.user, dto);
	}
}
