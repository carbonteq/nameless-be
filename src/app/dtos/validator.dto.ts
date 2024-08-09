import { BaseDto } from "@carbonteq/hexapp";
import z from "zod";

export class SubmitSchemaDto extends BaseDto {
	private static readonly schema = z.object({
		schema: z.record(z.unknown()),
	});

	private constructor(readonly schemaObj: Record<string, unknown>) {
		super();
	}

	static create(data: unknown) {
		return BaseDto.validate(SubmitSchemaDto.schema, data).map(
			({ schema }) => new SubmitSchemaDto(schema),
		);
	}
}
