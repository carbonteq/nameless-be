import { SubmitSchemaDto } from "@app/dtos/validator.dto";
import { SchemaWorkflows } from "@app/workflows/schema.workflows";
import { UUID } from "@carbonteq/hexapp";
import { Controller, Delete, Get, Post, Put, Req } from "@nestjs/common";
import { BodyDto } from "@web/utils/decorators/dto-wrapper";
import { UUIDParam } from "@web/utils/decorators/uuid-param.decorator";
import { FastifyRequest } from "fastify";

@Controller("/api/schema")
export class SchemaController {
	constructor(private readonly wfs: SchemaWorkflows) {}

	@Get()
	async getAllSchemas(@Req() req: FastifyRequest) {
		return await this.wfs.fetchAllForUser(req.user);
	}

	@Get("/:schemaId")
	async getSpecificSchema(
		@Req() req: FastifyRequest,
		@UUIDParam("schemaId") schemaId: UUID,
	) {
		return await this.wfs.fetchSpecificSchema(req.user, schemaId);
	}

	@Post()
	async saveValidationSchema(
		@Req() req: FastifyRequest,
		@BodyDto(SubmitSchemaDto) dto: SubmitSchemaDto,
	) {
		return await this.wfs.submitValidationSchema(req.user, dto);
	}

	@Put("/:schemaId")
	async updateSchema(
		@Req() req: FastifyRequest,
		@UUIDParam("schemaId") schemaId: UUID,
		@BodyDto(SubmitSchemaDto) dto: SubmitSchemaDto,
	) {
		return await this.wfs.updateSchema(req.user, schemaId, dto);
	}

	@Delete("/:schemaId")
	async deleteSchema(
		@Req() req: FastifyRequest,
		@UUIDParam("schemaId") schemaId: UUID,
	) {
		return await this.wfs.deleteSpecificSchema(req.user, schemaId);
	}
}
