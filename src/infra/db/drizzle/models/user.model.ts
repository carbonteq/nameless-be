import { Email } from "@carbonteq/hexapp";
import { pgTable, text } from "drizzle-orm/pg-core";
import sharedCols from "./shared-cols";

export const userTbl = pgTable("users", {
	...sharedCols,
	username: text("username").notNull().unique(),
	email: text("email").$type<Email>().notNull().unique(),
	pwHashed: text("pwHashed").notNull(),
});
