import { Option, Result } from "@carbonteq/fp"
import {
  BaseEntity,
  type IEntity,
  SimpleSerialized,
  UUID,
} from "@carbonteq/hexapp"
import { SchemaVo } from "@domain/value-objects/schema.vo"
import { User } from "../user/user.entity"
import { UnauthorizedSchemaOperation } from "./validation-schema.errors"

export interface IValidationSchema extends IEntity {
  schema: SchemaVo
  dataStoreId: Option<UUID>
  belongsTo: UUID
}

export type SerializedValidationSchema = SimpleSerialized<
  IValidationSchema,
  "schema" | "dataStoreId"
> & {
  schema: ReturnType<SchemaVo["serialize"]>
  dataStoreId: UUID | null
}

export class ValidationSchema extends BaseEntity implements IValidationSchema {
  #schema: SchemaVo
  #dataStoreId: Option<UUID>

  private constructor(
    readonly belongsTo: UUID,
    schema: IValidationSchema["schema"],
    dataStoreId: IValidationSchema["dataStoreId"],
  ) {
    super()

    this.#schema = schema
    this.#dataStoreId = dataStoreId
  }

  static new(
    schema: SchemaVo,
    user: User,
    dataStoreId: IValidationSchema["dataStoreId"],
  ) {
    return new ValidationSchema(user.id, schema, dataStoreId)
  }

  get schema() {
    return this.#schema
  }

  get dataStoreId() {
    return this.#dataStoreId
  }

  ensureBelongsTo(user: User): Result<this, UnauthorizedSchemaOperation> {
    if (user.id === this.belongsTo) return Result.Ok(this)

    return Result.Err(new UnauthorizedSchemaOperation(this.id, user.id))
  }

  updateSchema(
    updatedBy: User,
    updatedValues: SchemaVo,
    dataStoreId: IValidationSchema["dataStoreId"],
  ) {
    return this.ensureBelongsTo(updatedBy).map(_ => {
      this.#schema = updatedValues
      this.#dataStoreId = dataStoreId

      this.markUpdated()

      return this
    })
  }

  forUpdate() {
    return {
      ...super.forUpdate(),
      schema: this.#schema.serialize(),
      dataStoreId: this.#dataStoreId,
    }
  }

  static fromSerialized(other: SerializedValidationSchema): ValidationSchema {
    const ent = new ValidationSchema(
      other.belongsTo,
      SchemaVo.fromSerialized(other.schema),
      Option.fromNullable(other.dataStoreId),
    )

    ent._fromSerialized(other)

    return ent
  }

  serialize(): SerializedValidationSchema {
    return {
      ...super._serialize(),
      belongsTo: this.belongsTo,
      schema: this.#schema.serialize(),
      dataStoreId: this.#dataStoreId.safeUnwrap(),
    }
  }
}
