import z from "zod";

const sharedBetweenAll = z
	.object({
		optional: z.boolean().default(false),
		nullable: z.boolean().default(false),
	})
	.partial();

const stringSchema = z
	.object({
		type: z.literal("string"),
		minLength: z.number().min(0).optional(),
		maxLength: z.number().min(0).optional(),
		regex: z.string().optional(),
		format: z.enum(["email", "uuid", "url"]).optional(),
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
	name: z.string().min(3),
	dataStoreId: z.string().uuid().optional(),
});

type ColumnValType = StringSchema | BooleanSchema | NumberSchema;
type ZodSchemas = z.ZodBoolean | z.ZodString | z.ZodNumber;
// // | z.ZodEffects<z.ZodString, string, string>;
// type AddOptional<T extends z.ZodTypeAny> = z.ZodOptional<T>;
// type AddNullable<T extends z.ZodTypeAny> = z.ZodNullable<T>;
// type AddDefault<T extends z.ZodTypeAny> = z.ZodDefault<T>;

// type ParserGeneratorRet =
// 	| ZodSchemas
// 	| AddOptional<ZodSchemas>
// 	| AddNullable<ZodSchemas>
// 	| AddDefault<ZodSchemas>
// 	| AddOptional<AddNullable<ZodSchemas>>
// 	| AddOptional<AddDefault<ZodSchemas>>;

const commonHandler = (s: ZodSchemas, subSchema: ColumnValType) => {
	let final: z.ZodTypeAny = s;

	if (subSchema.optional) final = final.optional();
	if (subSchema.default) final = final.default(subSchema.default);
	if (subSchema.nullable) final = final.nullable();

	return final;
};

const stringHandler = (subSchema: StringSchema) => {
	let s = z.string();

	if (subSchema.minLength) s = s.min(subSchema.minLength);
	if (subSchema.maxLength) s = s.max(subSchema.maxLength);
	if (subSchema.regex) s = s.regex(new RegExp(subSchema.regex));
	if (subSchema.format) {
		if (subSchema.format === "email") s = s.email();
		if (subSchema.format === "uuid") s = s.uuid();
		if (subSchema.format === "url") s = s.url();
	}

	return s;
};

const booleanHandler = (_subSchema: BooleanSchema) => {
	const s = z.boolean();

	return s;
};

const numberHandler = (subSchema: NumberSchema) => {
	let s = z.number();

	if (subSchema.min) s = s.min(subSchema.min);
	if (subSchema.max) s = s.max(subSchema.max);
	if (subSchema.integer) s = s.int();

	return s;
};

const valueParserGenerator = (subSchema: ColumnValType) => {
	if (subSchema.type === "string") {
		const s = stringHandler(subSchema);

		return commonHandler(s, subSchema);
	}

	if (subSchema.type === "boolean") {
		const s = booleanHandler(subSchema);

		return commonHandler(s, subSchema);
	}

	if (subSchema.type === "number") {
		const s = numberHandler(subSchema);

		return commonHandler(s, subSchema);
	}
	// error check :(
	throw new Error("undefined type");
};

export const toZodSchema = <T extends Record<string, unknown>>(schema: T) => {
	//console.log("Test Schema:", schema);
	const schemaParsed = zodSchemaValidator.safeParse(schema);

	//const schemaParsed = zodSchemaValidator.safeParse(schema);

	const shape: Record<string, z.ZodTypeAny> = {};

	if (!schemaParsed.success) {
		//console.error(schemaParsed.error); //error checkkk :(
		throw schemaParsed.error;
	}

	const columns: Record<string, ColumnValType> = schemaParsed.data.columns;
	//console.log(columns); //error chck again :(
	for (const [name, subSchema] of Object.entries(columns)) {
		const subZodSchema = valueParserGenerator(subSchema);
		shape[name] = subZodSchema;
	}

	const finalSchema = z.object(shape);

	return finalSchema;
};
