import Ajv from "ajv";
import metaSchema from "./metaSchema.json" with { type: "json" };
import testSchema from "./schematest.json" with { type: "json" };
import { toZodSchema } from "../zodSchemaBuilder.ts";
import testDataBad from "./testdatabad";
import testDataGood from "./testdatagood";

const ajv = new Ajv({ strict: true });

describe("Schema Validation Tests", () => {
    it("should validate the test schema against the meta schema", () => {
        const validateSchemaDef = ajv.compile(metaSchema);
        const isValid = validateSchemaDef(testSchema);

        console.debug("Schema definition is valid:", isValid);
        expect(isValid).toBe(true);
    });

    it("should generate a Zod schema and validate correct data", () => {
        const zodSchema = toZodSchema(testSchema);

        testDataGood.forEach((data, index) => {
            const result = zodSchema.safeParse(data);

            console.log(`Good data ${index + 1} validation result:`, result.success);
            expect(result.success).toBe(true);
        });
    });

    it("should generate a Zod schema and reject incorrect data", () => {
        const zodSchema = toZodSchema(testSchema);

        const result = zodSchema.safeParse(testDataBad);
        console.log("Bad data validation result:", result.success);
        expect(result.success).toBe(false);
    });
});

// Original Code for manual schema validation
const validateSchemaDef = ajv.compile(metaSchema);
const isValid = validateSchemaDef(testSchema);

console.debug("Schema definition is valid:", isValid);

if (isValid) {
    const zodSchema = toZodSchema(testSchema);

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
