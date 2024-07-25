import { PwHashingService } from "@app/services/pw-hashing.service";
import { Result } from "@carbonteq/fp";
import { Email } from "@carbonteq/hexapp";
import { ResetRequest } from "@domain/entities/reset-request/reset-request.entity";
import { InvalidResetReq } from "@domain/entities/reset-request/reset-request.errors";
import { User } from "@domain/entities/user/user.entity";
import { VerifyRequest } from "@domain/entities/verify-request/verify-request.entity";
import { InvalidVerifyReq } from "@domain/entities/verify-request/verify-request.errors";
import { Password } from "@domain/refined/user.refined";
import { Injectable, Res } from "@nestjs/common";

@Injectable()
export class UserDomainService {
	constructor(private readonly pwHashServ: PwHashingService) {}

	update(
		user: User,
		newPassword: Password | undefined,
		newEmail: Email | undefined,
	): User {
		if (newPassword) {
			user.passwordUpdate(this.pwHashServ.hash(newPassword));
		}

		if (newEmail) {
			user.emailUpdate(newEmail);
		}

		return user;
	}
}
