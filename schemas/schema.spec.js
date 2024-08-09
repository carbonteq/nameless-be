import Ajv from "ajv";
import metaSchema from "./metaSchema.json" with { type: "json" };
import { createZodSchemaBuilder } from "../zodSchemaBuilder.ts";
import z from "zod";

// Sample schema definition for testing
const testSchema = {
  "$schema": "./metaSchema.json",
  "columns": {
    "name": { "type": "string", "nullable": true },
    "age": {
      "type": "number",
      "min": 10,
      "max": 65,
      "integer": true
    },
    "subToNewsletter": { "type": "boolean", "default": true },
    "someUrl": { "type": "string", "format": "url", "optional": true }
  }
};

// Sample data to validate against the generated Zod schema
const validData = {
  name: 'John Doe',
  age: 30,
  subToNewsletter: true,
  someUrl: 'https://example.com'
};

const invalidData = {
  name: 'John Doe',
  age: 5,  // Invalid: age is less than the minimum of 10
  subToNewsletter: true,
  someUrl: 'invalid-url'  // Invalid: not a valid URL format
};

// Initialize Ajv
const ajv = new Ajv({ strict: true });

// Compile the meta schema
const validateMetaSchema = ajv.compile(metaSchema);

// Validate the test schema against the meta schema
const isTestSchemaValid = validateMetaSchema(testSchema);
console.debug("Test schema definition is valid:", isTestSchemaValid);

if (isTestSchemaValid) {
  
  // Convert the schema to Zod schema
  const zodSchema = createZodSchemaBuilder(testSchema);

  // Validate valid data against the Zod schema
  const resultValid = zodSchema.safeParse(validData);
  console.log('Valid data test result:', resultValid);

  // Validate invalid data against the Zod schema
  const resultInvalid = zodSchema.safeParse(invalidData);
  console.log('Invalid data test result:', resultInvalid);
}
