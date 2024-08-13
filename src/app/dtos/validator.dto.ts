import { Option } from "@carbonteq/fp";
import { BaseDto, UUID } from "@carbonteq/hexapp";
import z from "zod";

export class SubmitSchemaDto extends BaseDto {
	private static readonly schema = z.object({
		schema: z.record(z.unknown()),
		dataStoreId: UUID.nullable().transform(Option.fromNullable),
	});

	private constructor(
		readonly schemaObj: Record<string, unknown>,
		readonly dataStoreId: Option<UUID>,
	) {
		super();
	}

	static create(data: unknown) {
		return BaseDto.validate(SubmitSchemaDto.schema, data).map(
			({ schema, dataStoreId }) => new SubmitSchemaDto(schema, dataStoreId),
		);
	}
}
