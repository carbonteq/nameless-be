import Ajv from "ajv";
import metaSchema from "../metaSchema.json";
import { describe, assert } from "poku";

const metaValidator = new Ajv({ strict: true });

describe("Validate metaSchema", { icon: "🔬", background: "brightMagenta" });
describe("Validate metaSchema", () => {
	assert.doesNotThrow(() => {
		metaValidator.validateSchema(metaSchema, true);
	});
});
