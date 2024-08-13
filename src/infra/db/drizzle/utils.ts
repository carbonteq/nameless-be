import {
  BaseEntity,
  RepositoryResult,
  assertUnreachable,
} from "@carbonteq/hexapp"

// https://www.postgresql.org/docs/current/errcodes-appendix.html
const DrizzleErrors = {
  UniqueConstraintViolation: "23505",
  ForeignKeyViolation: "23503",
} as const
type DrizzleErrKey = keyof typeof DrizzleErrors
type DrizzleErrCode = (typeof DrizzleErrors)[DrizzleErrKey]

interface DrizzleErr extends Error {
  code: DrizzleErrCode
}

export const isDrizzleErr = (e: unknown): e is DrizzleErr =>
  /* @ts-ignore*/
  e instanceof Error && e.code !== undefined

type DrizzleErrHandler<T> = (err: DrizzleErr) => RepositoryResult<T>

const handleOrThrow = <T>(
  handler: DrizzleErrHandler<T> | undefined,
  err: DrizzleErr,
) => {
  if (handler === undefined) throw err

  return handler(err)
}

export const handleDrizzleErr = <Ent extends BaseEntity>(
  err: unknown,
  handlers: Partial<Record<DrizzleErrKey, DrizzleErrHandler<Ent>>>,
) => {
  const { ForeignKeyViolation, UniqueConstraintViolation } = handlers

  if (isDrizzleErr(err)) {
    switch (err.code) {
      case DrizzleErrors.UniqueConstraintViolation:
        return handleOrThrow(UniqueConstraintViolation, err)
      case DrizzleErrors.ForeignKeyViolation:
        return handleOrThrow(ForeignKeyViolation, err)
      default:
        assertUnreachable(err.code)
    }
  }

  throw err
}
