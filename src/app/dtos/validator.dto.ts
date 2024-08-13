import { Option } from "@carbonteq/fp"
import { BaseDto, UUID } from "@carbonteq/hexapp"
import z from "zod"

const schemaSchema = z.object({
  schema: z.record(z.unknown()),
  dataStoreId: UUID.nullable().transform(Option.fromNullable),
})

export class SubmitSchemaDto extends BaseDto {
  private constructor(
    readonly schemaObj: Record<string, unknown>,
    readonly dataStoreId: Option<UUID>,
  ) {
    super()
  }

  static create(data: unknown) {
    return BaseDto.validate(schemaSchema, data).map(
      ({ schema, dataStoreId }) => new SubmitSchemaDto(schema, dataStoreId),
    )
  }
}
