import { DateTime, UUID } from "@carbonteq/hexapp";
import { relations } from "drizzle-orm";
import { boolean, pgTable, uuid } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import sharedCols from "./shared-cols";
import { userTbl } from "./user.model";

export const resetReqTbl = pgTable("reset_requests", {
	...sharedCols,
	userId: uuid("user_id")
		.$type<UUID>()
		.notNull()
		.references(() => userTbl.id),
	expiryDate: timestamp("expiry_date", { mode: "date" })
		.$type<DateTime>()
		.notNull(),
	active: boolean("active").notNull(),
});
