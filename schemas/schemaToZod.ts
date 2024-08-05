import z, { ZodRawShape } from "zod";

const sharedBetweenAll = z
	.object({
		optional: z.boolean().default(false),
	})
	.partial();

const stringSchema = z
	.object({
		type: z.literal("string"),
		minLength: z.number().min(0).optional(),
		maxLength: z.number().min(0).optional(),
		regex: z.string().optional(),
	})
	.merge(sharedBetweenAll);
type StringSchema = z.infer<typeof stringSchema>;

const booleanSchema = z
	.object({
		type: z.literal("boolean"),
	})
	.merge(sharedBetweenAll);
type BooleanSchema = z.infer<typeof booleanSchema>;

const objectSchema = z
	.object({
		type: z.literal("object"),
		properties: z.record(
			z.union([stringSchema, booleanSchema, z.lazy(() => objectSchema)]),
		),
	})
	.merge(sharedBetweenAll);
type ObjectSchema = {
	type: "object";
	properties: Record<string, StringSchema | BooleanSchema | ObjectSchema>;
};

const zodSchemaValidator = z.object({
	columns: z.record(
		z.discriminatedUnion("type", [stringSchema, booleanSchema, objectSchema]),
	),
});

type ColumnValType = StringSchema | BooleanSchema | ObjectSchema;

const valueParserGenerator = (subSchema: ColumnValType) => {
	if (subSchema.type === "string") {
		let s = z.string();

		if (subSchema.minLength) s = s.min(subSchema.minLength);
		if (subSchema.maxLength) s = s.max(subSchema.maxLength);
		if (subSchema.regex) s = s.regex(new RegExp(subSchema.regex));

		return subSchema.optional ? s.optional() : s;
	}

	if (subSchema.type === "boolean") {
		const s = z.boolean();
		return subSchema.optional ? s.optional() : s;
	}

	// if (subSchema.type === "object") {
	// 	const shape: Record<string, ReturnType<typeof valueParserGenerator>> = {};
	//
	// 	for (const [name, sub] of Object.entries(subSchema.properties)) {
	// 		shape[name] = valueParserGenerator(sub);
	// 	}
	//
	// 	return z.object(shape);
	// }

	throw new Error("undefined type");
};

export const toZodSchema = (schema: Record<string, unknown>) => {
	const schemaParsed = zodSchemaValidator.safeParse(schema);

	const shape: Record<string, ReturnType<typeof valueParserGenerator>> = {};

	if (schemaParsed.success) {
		const columns: Record<string, ColumnValType> = schemaParsed.data.columns;

		for (const [name, subSchema] of Object.entries(columns)) {
			const subZodSchema = valueParserGenerator(subSchema);
			shape[name] = subZodSchema;
		}
	}

	const finalSchema = z.object(shape);
};
