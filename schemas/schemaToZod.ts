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
	})
	.merge(sharedBetweenAll);
type StringSchema = z.infer<typeof stringSchema>;

const numberSchema = z
	.object({
		type: z.literal("number"),
		min: z.number().min(0).optional(),
		max: z.number().min(0).optional(),
		integer: z.boolean().optional().default(true),
	})
	.merge(sharedBetweenAll);
type NumberSchema = (typeof numberSchema)["_output"];

const booleanSchema = z
	.object({
		type: z.literal("boolean"),
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
type AddOptional<T extends z.ZodTypeAny> = T | z.ZodOptional<T>;

type ParserGeneratorRet = AddOptional<ZodSchemas>;

const valueParserGenerator = (subSchema: ColumnValType): ParserGeneratorRet => {
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

	if (subSchema.type === "number") {
		let s = z.number();

		if (subSchema.min) s = s.min(subSchema.min);
		if (subSchema.max) s = s.max(subSchema.max);
		if (subSchema.integer) s = s.int();

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
