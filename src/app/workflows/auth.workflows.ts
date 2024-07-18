import type {
	ForgotPasswordDto,
	LoginDto,
	ResetPasswordDto,
	SignUpDto,
} from "@app/dtos/auth.dto";
import { AuthTokenService } from "@app/services/auth-token.service";
import { EmailService } from "@app/services/email.service";
import { PwHashingService } from "@app/services/pw-hashing.service";
import { AppResult } from "@carbonteq/hexapp";
import { ResetRequest } from "@domain/entities/reset-request/reset-request.entity";
import { ResetRequestRepository } from "@domain/entities/reset-request/reset-request.repository";
import { User } from "@domain/entities/user/user.entity";
import { UserRepository } from "@domain/entities/user/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthWorkflows {
	constructor(
		private readonly pwHashServ: PwHashingService,
		private readonly tokenServ: AuthTokenService,
		private readonly userRepo: UserRepository,
		private readonly resetRequestRepo: ResetRequestRepository,
		private readonly emailServ: EmailService,
	) {}

	async login({ email, password }: LoginDto) {
		const userRes = await this.userRepo.fetchByEmail(email);

		const tokenRes = userRes
			.bindErr((user) => this.pwHashServ.compare(password, user.pwHashed))
			.map((user) => this.tokenServ.sign({ userId: user.id }));

		return AppResult.fromResult(tokenRes);
	}

	async signup({ email, password, username }: SignUpDto) {
		const pwHashed = this.pwHashServ.hash(password);

		const user = await this.userRepo.insert(
			User.new(username, email, pwHashed),
		);

		// TODO: send verification email after adding isVerified property on user

		const loginToken = user.map((u) => this.tokenServ.sign({ userId: u.id }));

		return AppResult.fromResult(loginToken);
	}

	async forgotPassword({ email, baseUrl }: ForgotPasswordDto) {
		const user = await this.userRepo.fetchByEmail(email);

		const resetReq = await user
			.map(ResetRequest.forUser)
			.bind((req) => this.resetRequestRepo.insert(req));

		const _emailRes = await resetReq.map((req) =>
			this.emailServ.sendForgotPasswordEmail(email, baseUrl, req.id),
		);

		return AppResult.Ok({
			message: "You'll recieve an email with the link to reset your password",
		});
	}

	async resetPassword({ reqId: token, newPassword }: ResetPasswordDto) {
		//TODO: Find token from resetRequest table from the db.
		//TODO: Find the user using the userID obtained from token.
		//TODO: Create a new Hash against the newPassword.
		//TODO: Update user password in the database.
	}

	// TODO: complete this
	async verifyUser() {}
}
