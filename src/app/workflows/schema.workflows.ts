import { SubmitSchemaDto } from "@app/dtos/validator.dto"
import { AppResult, Logger, UUID, toSerialized } from "@carbonteq/hexapp"
import { ValidationSchema } from "@domain/entities/schema/validation-schema.entity"
import { ValidationSchemaRepository } from "@domain/entities/schema/validation-schema.repository"
import { User } from "@domain/entities/user/user.entity"
import { SchemaVo } from "@domain/value-objects/schema.vo"
import { Injectable } from "@nestjs/common"

@Injectable()
export class SchemaWorkflows {
  constructor(
    private readonly logger: Logger,
    private readonly repo: ValidationSchemaRepository,
  ) {
    logger.setContext("SchemaWorkflows")
  }

  async submitValidationSchema(
    user: User,
    { schemaObj, dataStoreId }: SubmitSchemaDto,
  ) {
    // Validate schemaObj is valid
    const schemaRes = SchemaVo.create(schemaObj)
    // Create schema entity and persist it (in db)
    const schemaEntity = await schemaRes
      .map(vo => ValidationSchema.new(vo, user, dataStoreId))
      .flatMap(schema => this.repo.insert(schema))
    // Return some data signifying success or failure

    return AppResult.fromResult(schemaEntity.map(toSerialized))
  }

  async fetchAllForUser(user: User) {
    const schemas = await this.repo.fetchForUser(user)

    const view = schemas.innerMap(toSerialized)
    return AppResult.fromResult(view)
  }

  async fetchSpecificSchema(user: User, schemaId: UUID) {
    const fetchRes = await this.repo.fetchById(schemaId)

    const view = fetchRes
      .flatMap(schema => schema.ensureBelongsTo(user))
      .map(toSerialized)
    return AppResult.fromResult(view)
  }

  async updateSchema(
    user: User,
    schemaId: UUID,
    { dataStoreId, schemaObj }: SubmitSchemaDto,
  ) {
    const schemaValidated = SchemaVo.create(schemaObj)
    const schemaRes = await schemaValidated.flatZip(_ =>
      this.repo.fetchById(schemaId),
    )
    const updatedSchema = await schemaRes
      .flatMap(([updatedValues, schema]) =>
        schema.updateSchema(user, updatedValues, dataStoreId),
      )
      .flatMap(updated => this.repo.update(updated))

    const view = updatedSchema.map(toSerialized)
    return AppResult.fromResult(view)
  }

  async deleteSpecificSchema(user: User, schemaId: UUID) {
    const fetchRes = await this.repo.fetchById(schemaId)
    const deleteRes = await fetchRes
      .flatMap(schema => schema.ensureBelongsTo(user))
      .flatMap(schema => this.repo.delete(schema))

    const view = deleteRes.map(toSerialized)
    return AppResult.fromResult(view)
  }
}
