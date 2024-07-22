import { Result } from "@carbonteq/fp";
import { ResetRequest } from "@domain/entities/reset-request/reset-request.entity";
import { InvalidResetReq } from "@domain/entities/reset-request/reset-request.errors";
import { User } from "@domain/entities/user/user.entity";
import { Injectable, Res } from "@nestjs/common";

@Injectable()
export class AuthDomainService {
	updatePassword(
		resetPasswordReq: ResetRequest,
		user: User,
		newPwHashed: string,
	): Result<[User, ResetRequest], InvalidResetReq> {
		return resetPasswordReq.setInvactive().map((validatedReq) => {
			const updatedUser = user.passwordUpdate(newPwHashed);
			return [updatedUser, validatedReq] as [User, ResetRequest];
		});
	}
}
