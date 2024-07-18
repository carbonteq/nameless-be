import { date, pgTable, text } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import sharedCols from "./shared-cols";

export const resetRequestTbl = pgTable("reset_requests", {
	...sharedCols,
	userId: text("user_id").notNull(), //It is unique in order to make sure that only one request exists against a UserID.
	token: text("token").notNull().unique(),
	expiryDate: timestamp("expiry_date", { mode: "date" }).notNull(),
});
