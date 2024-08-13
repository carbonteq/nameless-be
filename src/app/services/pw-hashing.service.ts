import type { UnitResult } from "@carbonteq/fp"
import type { InvalidCredentials } from "@domain/entities/user/user.errors"
import { Password } from "@domain/refined/user.refined"

export abstract class PwHashingService {
  abstract hash(plain: Password): string
  abstract compare(
    plain: string,
    hashed: string,
  ): UnitResult<InvalidCredentials>
}
