import { SubmitSchemaDto } from "@app/dtos/validator.dto";
import { AppResult, Logger, toSerialized } from "@carbonteq/hexapp";
import { ValidationSchema } from "@domain/entities/schema/validation-schema.entity";
import { ValidationSchemaRepository } from "@domain/entities/schema/validation-schema.repository";
import { User } from "@domain/entities/user/user.entity";
import { SchemaVo } from "@domain/value-objects/schema.vo";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SchemaWorkflows {
	constructor(
		private readonly logger: Logger,
		private readonly repo: ValidationSchemaRepository,
	) {
		logger.setContext("SchemaWorkflows");
	}

	async submitValidationSchema(
		user: User,
		{ schemaObj, dataStoreId }: SubmitSchemaDto,
	) {
		// Validate schemaObj is valid
		const schemaRes = SchemaVo.create(schemaObj);
		// Create schema entity and persist it (in db)
		const schemaEntity = await schemaRes
			.map((vo) => ValidationSchema.new(vo, user, dataStoreId))
			.flatMap((schema) => this.repo.insert(schema));
		// Return some data signifying success or failure

		return AppResult.fromResult(schemaEntity.map(toSerialized));
	}
}
