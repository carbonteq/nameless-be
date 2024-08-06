import { toZodSchema } from "./schemaToZod";
import goodData from "./test-data-good";
import badData from "./test-data-bad";
import Ajv from "ajv";
import metaSchema from "./metaSchema.json";
import testSchema from "./test-schema.json";

const metaValidator = new Ajv({ strict: true });

metaValidator.validateSchema(metaSchema, true);

const validator = metaValidator.compile(metaSchema);

validator(testSchema);

const main = async () => {
	const schema = toZodSchema(testSchema);

	for (const datum of goodData) {
		schema.parse(datum);
	}

	const badDataRes = schema.safeParse(badData);
	console.debug("Bad data result:", badDataRes.success);
};

main();
