import { Result } from "@carbonteq/fp"
import { ResetRequest } from "@domain/entities/reset-request/reset-request.entity"
import { InvalidResetReq } from "@domain/entities/reset-request/reset-request.errors"
import { User } from "@domain/entities/user/user.entity"
import { VerifyRequest } from "@domain/entities/verify-request/verify-request.entity"
import { InvalidVerifyReq } from "@domain/entities/verify-request/verify-request.errors"
import { Injectable, Res } from "@nestjs/common"

@Injectable()
export class AuthDomainService {
  updatePassword(
    resetPasswordReq: ResetRequest,
    user: User,
    newPwHashed: string,
  ): Result<[ResetRequest, User], InvalidResetReq> {
    return resetPasswordReq
      .setInvactive()
      .flatMap(resetPasswordReq => resetPasswordReq.guardAgainstExpiry())
      .flatZip(() => user.passwordUpdate(newPwHashed))
  }

  verifyUser(
    verifyReq: VerifyRequest,
    user: User,
  ): Result<[VerifyRequest, User], InvalidVerifyReq> {
    return verifyReq
      .setInvactive()
      .flatMap(verifyReq => verifyReq.guardAgainstExpiry())
      .zip(() => user.setIsVerified(true))
  }
}
