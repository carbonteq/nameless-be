import { toZodSchema } from "./schemaToZod";
import schema from "./test-schema.json";
import goodData from "./test-data-good";
import badData from "./test-data-bad";
import Ajv from "ajv";
import metaSchema from "./metaSchema";
import testSchema from "./test-schema.json";

const metaValidator = new Ajv({ strict: true });

metaValidator.validateSchema(metaSchema, true);

const validator = metaValidator.compile(metaSchema);

validator(testSchema);

// Create zod schema based on json schema

// should fail on bad data

// should pass with good data
