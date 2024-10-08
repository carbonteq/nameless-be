import { Result } from "@carbonteq/fp"
import { RepositoryResult } from "@carbonteq/hexapp"
import { User } from "@domain/entities/user/user.entity"
import {
  InvalidCredentials,
  UserAlreadyExists,
  UserNotFound,
} from "@domain/entities/user/user.errors"
import { UserRepository } from "@domain/entities/user/user.repository"
import { Injectable, Provider } from "@nestjs/common"
import { eq } from "drizzle-orm"
import { DrizzleDb, InjectDb } from "../db-connection"
import { userTbl } from "../models/user.model"
import { handleDrizzleErr } from "../utils"

const fromDb = <E>(
  data: typeof userTbl.$inferSelect | undefined,
  errFactory: () => E,
): Result<User, E> => {
  if (!data) return Result.Err(errFactory())

  return Result.Ok(User.fromSerialized(data))
}

@Injectable()
class UserDrizzleRepo extends UserRepository {
  constructor(@InjectDb() private readonly db: DrizzleDb) {
    super()
  }

  async update(user: User): Promise<RepositoryResult<User, UserNotFound>> {
    const data = user.forUpdate()

    await this.db.update(userTbl).set(data).where(eq(userTbl.id, user.id))

    return Result.Ok(user)
  }

  async insert(user: User): Promise<RepositoryResult<User, UserAlreadyExists>> {
    const data = user.serialize()

    try {
      await this.db.insert(userTbl).values(data)

      return Result.Ok(user)
    } catch (err) {
      return handleDrizzleErr(err, {
        UniqueConstraintViolation: e => {
          const isUsernameErr = e.message.includes("username")

          const [identifier, field] = isUsernameErr
            ? ([user.username, "username"] as const)
            : ([user.email, "email"] as const)

          return Result.Err(new UserAlreadyExists(identifier, field))
        },
      })
    }
  }

  async fetchById(
    id: User["id"],
  ): Promise<RepositoryResult<User, UserNotFound>> {
    const data = await this.db.query.users.findFirst({
      where: eq(userTbl.id, id),
    })

    return fromDb(data, () => new UserNotFound(id))
  }

  async fetchByEmail(
    email: User["email"],
  ): Promise<RepositoryResult<User, InvalidCredentials>> {
    const data = await this.db.query.users.findFirst({
      where: eq(userTbl.email, email),
    })

    return fromDb(data, () => new InvalidCredentials())
  }
}

export const UserRepoProvider: Provider<UserRepository> = {
  provide: UserRepository,
  useClass: UserDrizzleRepo,
}
