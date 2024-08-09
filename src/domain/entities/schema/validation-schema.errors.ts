import { AlreadyExistsError, NotFoundError, UUID } from "@carbonteq/hexapp";

export class ValidationSchemaNotFound extends NotFoundError {
	constructor(readonly id: UUID) {
		super(`ValidationSchema<${id}> does not exist`);
	}
}

export class ValidationSchemaAlreadyExists extends AlreadyExistsError {}
