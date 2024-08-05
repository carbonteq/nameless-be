import Ajv from "ajv";
import metaSchema from "./schemas/metaSchema.json" with { type: "json" };
import testSchema from "./schematest.json" with { type: "json" };

const ajv = new Ajv({ strict: true });

const validateSchemaDef = ajv.compile(metaSchema, true);

const isValid = validateSchemaDef(testSchema);

console.debug("Schema definition is valid:", isValid);
