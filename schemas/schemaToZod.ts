import z from "zod";

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
		format: z.enum(["email", "uuid"]).optional(),
		default: z.string().optional(),
	})
	.merge(sharedBetweenAll);
type StringSchema = z.infer<typeof stringSchema>;

const numberSchema = z
	.object({
		type: z.literal("number"),
		min: z.number().min(0).optional(),
		max: z.number().min(0).optional(),
		integer: z.boolean().optional().default(true),
		default: z.number().optional(),
	})
	.merge(sharedBetweenAll);
type NumberSchema = (typeof numberSchema)["_output"];

const booleanSchema = z
	.object({
		type: z.literal("boolean"),
		default: z.boolean().optional(),
	})
	.merge(sharedBetweenAll);
type BooleanSchema = z.infer<typeof booleanSchema>;

// const arraySchema = z.object({
// 	type: z.literal("array"),
// 	items: z.array(
// 		z.union([
// 			stringSchema,
// 			booleanSchema,
// 			z.lazy(() => objectSchema),
// 			z.lazy(() => arraySchema),
// 		]),
// 	),
// });
//
// const objectSchema = z
// 	.object({
// 		type: z.literal("object"),
// 		properties: z.record(
// 			z.union([
// 				stringSchema,
// 				booleanSchema,
// 				z.lazy(() => objectSchema),
// 				z.lazy(() => arraySchema),
// 			]),
// 		),
// 	})
// 	.merge(sharedBetweenAll);
// type ObjectSchema = {
// 	type: "object";
// 	properties: Record<string, StringSchema | BooleanSchema | ObjectSchema>;
// };

const zodSchemaValidator = z.object({
	columns: z.record(
		z.discriminatedUnion("type", [stringSchema, booleanSchema, numberSchema]),
	),
});

type ColumnValType = StringSchema | BooleanSchema | NumberSchema;
type ZodSchemas = z.ZodBoolean | z.ZodString | z.ZodNumber;
// | z.ZodEffects<z.ZodString, string, string>;
type AddOptional<T extends z.ZodTypeAny> = z.ZodOptional<T>;
type AddDefault<T extends z.ZodTypeAny> = z.ZodDefault<T>;

type ParserGeneratorRet =
	| ZodSchemas
	| AddOptional<ZodSchemas>
	| AddDefault<ZodSchemas>
	| AddOptional<AddDefault<ZodSchemas>>;

const stringHandler = (subSchema: StringSchema) => {
	let s = z.string();

	if (subSchema.minLength) s = s.min(subSchema.minLength);
	if (subSchema.maxLength) s = s.max(subSchema.maxLength);
	if (subSchema.regex) s = s.regex(new RegExp(subSchema.regex));
	if (subSchema.format) {
		if (subSchema.format === "email") s = s.email();
		if (subSchema.format === "uuid") s = s.uuid();
	}
	if (subSchema.default) {
		return s.default(subSchema.default);
	}

	return s;
};

const booleanHandler = (subSchema: BooleanSchema) => {
	const s = z.boolean();

	if (subSchema.default) return s.default(subSchema.default);

	return s;
};

const numberHandler = (subSchema: NumberSchema) => {
	let s = z.number();

	if (subSchema.min) s = s.min(subSchema.min);
	if (subSchema.max) s = s.max(subSchema.max);
	if (subSchema.integer) s = s.int();

	if (subSchema.default) return s.default(subSchema.default);

	return s;
};

const valueParserGenerator = (subSchema: ColumnValType): ParserGeneratorRet => {
	if (subSchema.type === "string") {
		const s = stringHandler(subSchema);

		return subSchema.optional ? s.optional() : s;
	}

	if (subSchema.type === "boolean") {
		const s = booleanHandler(subSchema);
		return subSchema.optional ? s.optional() : s;
	}

	if (subSchema.type === "number") {
		const s = numberHandler(subSchema);
		return subSchema.optional ? s.optional() : s;
	}

	throw new Error("undefined type");
};

export const toZodSchema = <T extends Record<string, unknown>>(schema: T) => {
	const schemaParsed = zodSchemaValidator.safeParse(schema);

	const shape: Record<string, ParserGeneratorRet> = {};

	if (!schemaParsed.success) throw schemaParsed.error;

	const columns: Record<string, ColumnValType> = schemaParsed.data.columns;

	for (const [name, subSchema] of Object.entries(columns)) {
		const subZodSchema = valueParserGenerator(subSchema);
		shape[name] = subZodSchema;
	}

	const finalSchema = z.object(shape);

	return finalSchema;
};
