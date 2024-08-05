export default {
	$schema: "http://json-schema.org/draft-07/schema#",
	$id: "https://github.com/carbonteq/nameless-be/blob/main/schemas/metaSchema.json",
	title: "Nameless DSL",
	description: "Some description",
	type: "object",
	properties: {
		columns: {
			description: "List of columns with constraints",
			type: "object",
			required: [],
			additionalProperties: {
				oneOf: [
					{ $ref: "#/definitions/stringSchema" },
					{ $ref: "#/definitions/numberSchema" },
					{ $ref: "#/definitions/booleanSchema" },
					{ $ref: "#/definitions/arraySchema" },
					{ $ref: "#/definitions/objectSchema" },
				],
			},
		},
	},
	additionalProperties: true,
	required: ["columns"],
	definitions: {
		baseSchema: {
			type: "object",
			properties: { optional: { type: "boolean" } },
		},
		stringSchema: {
			allOf: [
				{ $ref: "#/definitions/baseSchema" },
				{
					type: "object",
					properties: {
						type: { const: "string" },
						minLength: { type: "number", minimum: 0 },
						maxLength: { type: "number", minimum: 0 },
						regex: { type: "string" },
					},
					additionalProperties: false,
					required: ["type"],
				},
			],
		},
		numberSchema: {
			allOf: [
				{ $ref: "#/definitions/baseSchema" },
				{
					type: "object",
					properties: {
						type: { const: "number" },
						min: { type: "number" },
						max: { type: "number" },
						integer: { type: "boolean", default: true },
					},
					additionalProperties: false,
					required: ["type"],
				},
			],
		},
		booleanSchema: {
			allOf: [
				{ $ref: "#/definitions/baseSchema" },
				{
					type: "object",
					properties: {
						type: { const: "boolean" },
					},
					additionalProperties: false,
					required: ["type"],
				},
			],
		},
		arraySchema: {
			allOf: [
				{ $ref: "#/definitions/baseSchema" },
				{
					type: "object",
					properties: {
						type: { const: "array" },
						items: {
							oneOf: [
								{ $ref: "#/definitions/stringSchema" },
								{ $ref: "#/definitions/numberSchema" },
								{ $ref: "#/definitions/booleanSchema" },
								{ $ref: "#/definitions/arraySchema" },
								{ $ref: "#/definitions/objectSchema" },
							],
						},
					},
					additionalProperties: false,
					required: ["type", "items"],
				},
			],
		},
		objectSchema: {
			allOf: [
				{ $ref: "#/definitions/baseSchema" },
				{
					type: "object",
					properties: {
						type: { const: "object" },
						properties: {
							type: "object",
							additionalProperties: {
								oneOf: [
									{ $ref: "#/definitions/stringSchema" },
									{ $ref: "#/definitions/numberSchema" },
									{ $ref: "#/definitions/booleanSchema" },
									{ $ref: "#/definitions/arraySchema" },
									{ $ref: "#/definitions/objectSchema" },
								],
							},
						},
					},
					additionalProperties: false,
					required: ["type", "properties"],
				},
			],
		},
	},
} as const;
