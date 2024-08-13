import { Result, UnitResult } from "@carbonteq/fp"
import { BaseEntity, Email, type IEntity, Omitt } from "@carbonteq/hexapp"
import { Username } from "@domain/refined/user.refined"
import { SimpleSerialized } from "@shared/types"
import { UnverifiedUser } from "./user.errors"

export interface IUser extends IEntity {
  username: Username
  email: Email
  pwHashed: string
  isVerified: boolean //false by default
}

export type SerializedUser = SimpleSerialized<IUser>
type UserUpdateData = Omitt<IUser, "id" | "createdAt" | "username">

export class User extends BaseEntity implements IUser {
  #email: IUser["email"]
  #pwHashed: IUser["pwHashed"]
  #isVerified: boolean

  private constructor(
    readonly username: Username,
    email: Email,
    pwHashed: string,
    isVerified: boolean,
  ) {
    super()

    this.#email = email
    this.#pwHashed = pwHashed
    this.#isVerified = isVerified
  }

  get email() {
    return this.#email
  }

  get pwHashed() {
    return this.#pwHashed
  }

  get isVerified() {
    return this.#isVerified
  }

  static new(username: Username, email: Email, pwHashed: string) {
    return new User(username, email, pwHashed, false)
  }

  ensureIsVerified(): UnitResult<UnverifiedUser> {
    if (this.isVerified) return Result.UNIT_RESULT

    return Result.Err(new UnverifiedUser(this.id))
  }

  passwordUpdate(pwHashed: string) {
    return this.ensureIsVerified().map(_ => {
      this.#pwHashed = pwHashed
      this.markUpdated()

      return this
    })
  }

  emailUpdate(newEmail: Email) {
    return this.ensureIsVerified().map(_ => {
      this.#email = newEmail
      this.markUpdated()

      return this
    })
  }

  setIsVerified(status: boolean) {
    this.#isVerified = status
    this.markUpdated()

    return this
  }

  forUpdate(): UserUpdateData {
    return {
      ...super.forUpdate(),
      email: this.#email,
      pwHashed: this.#pwHashed,
      isVerified: this.#isVerified,
    }
  }

  static fromSerialized(other: SerializedUser): User {
    const ent = new User(
      other.username,
      other.email,
      other.pwHashed,
      other.isVerified,
    )

    ent._fromSerialized(other)

    return ent
  }

  serialize(): SerializedUser {
    return {
      ...super._serialize(),
      username: this.username,
      email: this.#email,
      pwHashed: this.#pwHashed,
      isVerified: this.#isVerified,
    }
  }
}
