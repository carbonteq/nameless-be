import {
  AlreadyExistsError,
  NotFoundError,
  UUID,
  UnauthorizedOperation,
} from "@carbonteq/hexapp"

export class ValidationSchemaNotFound extends NotFoundError {
  constructor(readonly id: UUID) {
    super(`ValidationSchema<${id}> does not exist`)
  }
}

export class ValidationSchemaAlreadyExists extends AlreadyExistsError {}

export class UnauthorizedSchemaOperation extends UnauthorizedOperation {
  constructor(
    readonly schemaId: UUID,
    readonly userId: UUID,
  ) {
    super(`Schema<${schemaId}> does not belong to user <${userId}>`)
  }
}
