import { UUID } from "@carbonteq/hexapp";
import { pgTable, uuid } from "drizzle-orm/pg-core";
import { json } from "drizzle-orm/pg-core";
import sharedCols from "./shared-cols";
import { userTbl } from "./user.model";

export const validationSchemaTbl = pgTable("validationSchema", {
	...sharedCols,
	schema: json("schema").$type<Record<string, unknown>>().notNull(),
	belongsTo: uuid("belongsTo")
		.$type<UUID>()
		.notNull()
		.references(() => userTbl.id),
});
