import Ajv from "ajv";
import metaSchema from "./metaSchema.json" with { type: "json" };
import testSchema from "./schematest.json" with { type: "json" };
import { createZodSchemaBuilder } from "../zodSchemaBuilder.ts";

const ajv = new Ajv({ strict: true });

const validateSchemaDef = ajv.compile(metaSchema);

const isValid = validateSchemaDef(testSchema);

console.debug("Schema definition is valid:", isValid);

if (isValid) {
  
  const zodSchema = createZodSchemaBuilder(testSchema);

  const data = {
    name: 'John Doe',
    age: 30,
    subToNewsletter: true,
    address: {
      city: 'sesome city',
      zipcode: '12345'
    },
    someNumbers: [1, 2, 3]
  };

  // Validate data against the Zod schema
  const result = zodSchema.safeParse(data);

  if (result.success) {
    console.log('Data is valid:', result.data);
  } else {
    console.error('Data is invalid:', result.error.errors);
  }
}
