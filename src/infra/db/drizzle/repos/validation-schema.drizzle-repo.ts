import { Result } from "@carbonteq/fp";
import { RepositoryResult } from "@carbonteq/hexapp";
import { ValidationSchema } from "@domain/entities/schema/validation-schema.entity";
import {
	ValidationSchemaAlreadyExists,
	ValidationSchemaNotFound,
} from "@domain/entities/schema/validation-schema.errors";
import { ValidationSchemaRepository } from "@domain/entities/schema/validation-schema.repository";
import { User } from "@domain/entities/user/user.entity";
import { Injectable, Provider } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DrizzleDb, InjectDb } from "../db-connection";
import { validationSchemaTbl } from "../models/validation-schema.model";

@Injectable()
class ValidationSchemaDrizzleRepo extends ValidationSchemaRepository {
	constructor(@InjectDb() private readonly db: DrizzleDb) {
		super();
	}

	async update(
		entity: ValidationSchema,
	): Promise<RepositoryResult<ValidationSchema, ValidationSchemaNotFound>> {
		const data = entity.forUpdate();

		const updated = await this.db
			.update(validationSchemaTbl)
			.set(data)
			.where(eq(validationSchemaTbl.id, entity.id))
			.returning();

		if (updated.length === 0)
			return Result.Err(new ValidationSchemaNotFound(entity.id));

		return Result.Ok(ValidationSchema.fromSerialized(updated[0]));
	}

	async insert(
		entity: ValidationSchema,
	): Promise<
		RepositoryResult<ValidationSchema, ValidationSchemaAlreadyExists>
	> {
		const data = entity.serialize();

		const inserted = await this.db
			.insert(validationSchemaTbl)
			.values(data)
			.returning();

		return Result.Ok(ValidationSchema.fromSerialized(inserted[0]));
	}

	async fetchById(
		id: ValidationSchema["id"],
	): Promise<RepositoryResult<ValidationSchema, ValidationSchemaNotFound>> {
		const data = await this.db.query.validationSchema.findFirst({
			where: eq(validationSchemaTbl.id, id),
		});

		if (!data) return Result.Err(new ValidationSchemaNotFound(id));

		return Result.Ok(ValidationSchema.fromSerialized(data));
	}

	async fetchForUser(
		user: User,
	): Promise<RepositoryResult<ValidationSchema[]>> {
		const data = await this.db.query.validationSchema.findMany({
			where: eq(validationSchemaTbl.belongsTo, user.id),
		});

		const schemas = data.map(ValidationSchema.fromSerialized);

		return Result.Ok(schemas);
	}
}

export const ValidationSchemaRepoProvider: Provider<ValidationSchemaRepository> =
	{
		provide: ValidationSchemaRepository,
		useClass: ValidationSchemaDrizzleRepo,
	};
