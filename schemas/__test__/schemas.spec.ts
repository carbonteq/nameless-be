import Ajv from "ajv";
import metaSchema from "../metaSchema.json";
import { describe, assert, it, test } from "poku";
import { toZodSchema } from "../schemaToZod";
import goodData from "../test-data-good";
import badData from "../test-data-bad";

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

const metaValidator = new Ajv({ strict: true });
const validateSchema = metaValidator.compile(metaSchema, true);
const schema = toZodSchema(testSchema);

test("test schema is valid", () => {
	assert(validateSchema(testSchema), "Test schema is valid");
});

describe("Good Data", { background: "blue" });
describe("Good Data", () => {
	it("passes", () => {
		for (const datum of goodData) {
			const validationRes = schema.safeParse(datum);

			assert(validationRes.success, validationRes.error?.message);
		}
	});
});

describe("Bad Data", { background: "red" });
describe("Bad Data", () => {
	it("fails", () => {
		for (const datum of badData) {
			const validationRes = schema.safeParse(datum);

			assert(!validationRes.success, `${JSON.stringify(datum)} should fail`);
		}
	});
});
