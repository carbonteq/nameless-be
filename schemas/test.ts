import { toZodSchema } from "./schemaToZod";
import Ajv from "ajv";
import metaSchema from "./metaSchema.json";
import testSchema from "./test-schema.json";

import goodData from "./test-data-good";
import badData from "./test-data-bad";
import { describe, assert } from "poku";

describe("Test Title", { icon: "🔬", background: "brightMagenta" });

// const metaValidator = new Ajv({ strict: true });
// metaValidator.validateSchema(metaSchema, true);
// const validator = metaValidator.compile(metaSchema);

// const runTests = () => {
// 	test("Validating test schema against meta-schema", () => {
// 		const isValid = validator(testSchema);
// 		console.assert(isValid, `Test schema is not valid: ${validator.errors}`);
// 	});

// 	const schema = toZodSchema(testSchema);

// 	test("Validating good data", () => {
// 		for (const datum of goodData) {
// 			try {
// 				schema.parse(datum);
// 				console.log("Good data passed validation:", datum);
// 			} catch (err) {
// 				console.error("Good data failed validation:", datum, err.errors);
// 			}
// 		}
// 	});

// 	test("Validating bad data", () => {
// 		const badDataRes = schema.safeParse(badData);
// 		console.assert(!badDataRes.success, "Bad data should not pass validation");
// 		if (!badDataRes.success) {
// 			console.log(
// 				"Bad data failed validation as expected:",
// 				badDataRes.error.errors,
// 			);
// 		} else {
// 			console.error(
// 				"Bad data unexpectedly passed validation:",
// 				badDataRes.data,
// 			);
// 		}
// 	});

// 	test("Validating empty schema", () => {
// 		const emptySchema = {};
// 		try {
// 			const emptyZodSchema = toZodSchema(emptySchema);
// 			emptyZodSchema.parse({});
// 		} catch (err) {
// 			console.assert(
// 				err instanceof Error,
// 				"Empty schema validation failed as expected",
// 			);
// 			console.log("Empty schema failed validation as expected:", err.errors);
// 		}
// 	});

// 	test("Validating partial schema", () => {
// 		const partialData = {
// 			name: "koko",
// 			age: null,
// 		};
// 		try {
// 			schema.parse(partialData);
// 			console.log("Partial data passed validation:", partialData);
// 		} catch (err) {
// 			console.error("Partial data failed validation:", partialData, err.errors);
// 		}
// 	});

// 	test("Validating missing required fields", () => {
// 		const missingFieldsData = {
// 			age: 25,
// 		};
// 		try {
// 			schema.parse(missingFieldsData);
// 			console.error(
// 				"Missing fields data unexpectedly passed validation:",
// 				missingFieldsData,
// 			);
// 		} catch (err) {
// 			console.assert(
// 				err instanceof Error,
// 				"Missing fields validation failed as expected",
// 			);
// 			console.log(
// 				"Missing fields data failed validation as expected:",
// 				err.errors,
// 			);
// 		}
// 	});
// };

// //wrap test cases with a description
// const test = (description, fn) => {
// 	console.log(`Running test: ${description}`);
// 	fn();
// 	console.log(`Completed test: ${description}\n`);
// };

// runTests();
