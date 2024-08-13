import { Email } from "@carbonteq/hexapp"
import { Username } from "@domain/refined/user.refined"
import { pgTable, text } from "drizzle-orm/pg-core"
import { boolean } from "drizzle-orm/pg-core"
import sharedCols from "./shared-cols"

export const userTbl = pgTable("users", {
  ...sharedCols,
  username: text("username").$type<Username>().notNull().unique(),
  email: text("email").$type<Email>().notNull().unique(),
  pwHashed: text("pwHashed").notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
})
