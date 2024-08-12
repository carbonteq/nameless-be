import { toZodSchema } from "../schemaToZod";
import Ajv from "ajv";
import metaSchema from "../metaSchema.json";
import goodData from "../test-data-good";
import badData from "../test-data-bad";
import { describe, assert, it } from "poku";

const metaValidator = new Ajv({ strict: true });
const validateSchema = metaValidator.compile(metaSchema, true);

const testSchema = {
	$schema: "../metaSchema.json",
	columns: {
		name: { type: "string", nullable: true },
		age: {
			type: "number",
			min: 10,
			max: 65,
			integer: true,
		},
		subToNewsletter: { type: "boolean", default: true },
		someUrl: { type: "string", format: "url", optional: true },
	},
};

const schema = toZodSchema(testSchema);

// Test Schema Validity
describe("Schema Validation", { icon: "🔬", background: "yellow" });

it("Validates test schema against meta-schema", () => {
	assert(validateSchema(testSchema), "Test schema is valid");
});

describe("Data Validation", () => {
	it("Validates good data", () => {
		for (const datum of goodData) {
			const validationRes = schema.safeParse(datum);

			assert(validationRes.success, `${JSON.stringify(datum)} should pass`);
		}
	});

	it("Validates bad data", () => {
		for (const datum of badData) {
			const validationRes = schema.safeParse(datum);
			assert(!validationRes.success, `${JSON.stringify(datum)} should fail`);
		}
	});

	// it("Validates  bad data", () => {
	// 	for(const datum of badData)
	// 	{
	// 		const
	// 	}
	// })

	it("Validates empty schema", () => {
		const emptySchema = { columns: {} };
		const emptyZodSchema = toZodSchema(emptySchema);
		const validationRes = emptyZodSchema.safeParse({});
		assert(validationRes.success, "Empty schema validation failed ");
	});

	it("Validates missing required fields", () => {
		const missingFieldsData = {
			age: 25,
		};
		const validationRes = schema.safeParse(missingFieldsData);
		assert(
			!validationRes.success,
			"Missing fields data should fail validation",
		);
	});
});

describe("handles default", () => {
	const defaultName = "Joe";
	const schema = toZodSchema({
		columns: { name: { type: "string", default: defaultName } },
	});

	it("uses actual provided value", () => {
		const valProvided = "Some Other Name";

		const parseRes = schema.parse({ name: valProvided });
		assert.equal(parseRes.name, valProvided);
	});

	it("uses default value if nothing provided", () => {
		const parseRes = schema.parse({});
		assert.equal(parseRes.name, defaultName);
	});
});

describe("handles optional", () => {});

describe("handles string formats", () => {});

describe("handles nullable", () => {});
