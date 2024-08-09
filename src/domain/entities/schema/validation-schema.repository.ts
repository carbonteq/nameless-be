import { BaseRepository, type RepositoryResult } from "@carbonteq/hexapp";
import { User } from "../user/user.entity";
import { ValidationSchema } from "./validation-schema.entity";
import {
	ValidationSchemaAlreadyExists,
	ValidationSchemaNotFound,
} from "./validation-schema.errors";

export abstract class ValidationSchemaRepository extends BaseRepository<ValidationSchema> {
	abstract update(
		entity: ValidationSchema,
	): Promise<RepositoryResult<ValidationSchema, ValidationSchemaNotFound>>;
	abstract insert(
		entity: ValidationSchema,
	): Promise<RepositoryResult<ValidationSchema, ValidationSchemaAlreadyExists>>;
	abstract fetchById(
		id: ValidationSchema["id"],
	): Promise<RepositoryResult<ValidationSchema, ValidationSchemaNotFound>>;
	abstract fetchForUser(
		user: User,
	): Promise<RepositoryResult<ValidationSchema[]>>;
}
