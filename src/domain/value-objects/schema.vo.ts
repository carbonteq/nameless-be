import { Result } from "@carbonteq/fp";
import { BaseValueObject, ValidationError } from "@carbonteq/hexapp";
import Ajv, { ValidateFunction } from "ajv";
import metaSchema from "./meta-schema";

const metaValidator = new Ajv({ strict: true });
const schemaValidator: ValidateFunction<{ columns: Record<string, unknown> }> =
	metaValidator.compile(metaSchema, true);

export class InvalidSchema extends ValidationError {
	constructor(
		readonly schemaObj: unknown,
		reasons: string[],
	) {
		super(`Invalid schema: <${JSON.stringify(schemaObj)}> - ${reasons}`);
	}
}

export class SchemaVo extends BaseValueObject<Record<string, unknown>> {
	private constructor(readonly val: Record<string, unknown>) {
		super();
	}

	static create(schemaObj: unknown): Result<SchemaVo, InvalidSchema> {
		const isValidSchema = schemaValidator(schemaObj);

		if (isValidSchema) return Result.Ok(new SchemaVo(schemaObj));

		const reasons = (schemaValidator.errors || []).map(
			(err) => err.message || "",
		);

		return Result.Err(new InvalidSchema(schemaObj, reasons));
	}

	static fromSerialized(schema: Record<string, unknown>): SchemaVo {
		return new SchemaVo(schema);
	}

	serialize(): Record<string, unknown> {
		return this.val;
	}
}
