import { relations } from "drizzle-orm"
import { resetReqTbl } from "./reset-request.model"
import { userTbl } from "./user.model"
import { validationSchemaTbl } from "./validation-schema.model"
import { verifyReqTbl } from "./verify-request.model"

export const verifyReqTblRels = relations(verifyReqTbl, ({ one }) => ({
  user: one(userTbl),
}))

export const resetReqTblRels = relations(resetReqTbl, ({ one }) => ({
  user: one(userTbl),
}))

export const validationSchemaRels = relations(
  validationSchemaTbl,
  ({ one }) => ({
    belongsTo: one(userTbl, {
      fields: [validationSchemaTbl.belongsTo],
      references: [userTbl.id],
    }),
  }),
)

export const userRels = relations(userTbl, ({ many }) => ({
  validationSchemas: many(validationSchemaTbl),
}))
