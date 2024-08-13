import { Email, UUID } from "@carbonteq/hexapp";
import { Username } from "@domain/refined/user.refined";
import { SchemaVo } from "@domain/value-objects/schema.vo";
import config from "@infra/config";
import { ArgonPwHasher } from "@infra/pwhashing";
import { v4 } from "@napi-rs/uuid";
import { drizzleConnFactory } from "./db-connection";
import { userTbl } from "./models/user.model";
import { validationSchemaTbl } from "./models/validation-schema.model";

const seed = async () => {
	const db = drizzleConnFactory();
	const pwHashServ = new ArgonPwHasher();

	const pwHashed = pwHashServ.hash(config.db.SEED_PWD);

	const devUsers: Array<typeof userTbl.$inferInsert> = [
		{
			id: v4(),
			username: "devguy" as Username,
			email: "dev@nameless.gg" as Email,
			pwHashed,
		},
		{
			id: v4(),
			username: "intern" as Username,
			email: "intern@nameless.gg" as Email,
			pwHashed,
		},
	];

	const schemas: Array<typeof validationSchemaTbl.$inferInsert> = [
		{
			belongsTo: UUID.fromTrusted(devUsers[0].id as string),
			schema: SchemaVo.create({
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
				name: "test schema",
			})
				.unwrap()
				.serialize(),
		},
		{
			belongsTo: UUID.fromTrusted(devUsers[0].id as string),
			schema: SchemaVo.create({
				columns: {
					constituentId: { type: "string", format: "uuid" },
					constituentEmail: { type: "string", format: "email" },
					classYear: {
						type: "number",
						integer: true,
						optional: true,
						min: 1970,
						max: 2030,
					},
					admin: { type: "boolean", default: false },
				},
				name: "lorem ipsum",
			})
				.unwrap()
				.serialize(),
		},

		{
			belongsTo: UUID.fromTrusted(devUsers[1].id as string),
			schema: SchemaVo.create({
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
				name: "foobarbaz",
			})
				.unwrap()
				.serialize(),
		},

		{
			belongsTo: UUID.fromTrusted(devUsers[1].id as string),
			schema: SchemaVo.create({
				columns: {
					constituentId: { type: "string", format: "uuid" },
					constituentEmail: { type: "string", format: "email" },
					classYear: {
						type: "number",
						integer: true,
						optional: true,
						min: 1970,
						max: 2030,
					},
					admin: { type: "boolean", default: false },
				},
				name: "think of it yourself",
			})
				.unwrap()
				.serialize(),
		},
	];

	console.time("Time for db ops");
	await db.insert(userTbl).values(devUsers);
	await db.insert(validationSchemaTbl).values(schemas);
	console.timeEnd("Time for db ops");

	console.debug("Done");
};

seed();
