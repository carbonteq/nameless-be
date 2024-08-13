import { Result } from "@carbonteq/fp"
import { BaseValueObject, ValidationError } from "@carbonteq/hexapp"
import Ajv, { ValidateFunction } from "ajv"
import metaSchema from "./meta-schema"

export interface SchemaProps {
  name: string
  columns: Record<string, unknown>
}

const metaValidator = new Ajv({ strict: true })
const schemaValidator: ValidateFunction<SchemaProps> = metaValidator.compile(
  metaSchema,
  true,
)

export class InvalidSchema extends ValidationError {
  constructor(
    readonly schemaObj: unknown,
    reasons: string[],
  ) {
    super(`Invalid schema: <${JSON.stringify(schemaObj)}> - ${reasons}`)
  }
}

export class SchemaVo extends BaseValueObject<SchemaProps> {
  private constructor(readonly val: SchemaProps) {
    super()
  }

  static create(schemaObj: unknown): Result<SchemaVo, InvalidSchema> {
    const isValidSchema = schemaValidator(schemaObj)

    if (isValidSchema) return Result.Ok(new SchemaVo(schemaObj))

    const reasons = (schemaValidator.errors || []).map(err => err.message || "")

    return Result.Err(new InvalidSchema(schemaObj, reasons))
  }

  static fromSerialized(schema: SchemaProps): SchemaVo {
    return new SchemaVo(schema)
  }

  serialize(): SchemaProps {
    return this.val
  }
}
