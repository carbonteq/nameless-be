import { UUID } from "@carbonteq/hexapp"
import { timestamp, uuid } from "drizzle-orm/pg-core"

const sharedCols = {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
}

export default sharedCols
