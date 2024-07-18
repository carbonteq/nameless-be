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

		// TODO: send email

		const loginToken = user.map((u) => this.tokenServ.sign({ userId: u.id }));

		return AppResult.fromResult(loginToken);
	}

	async forgotPassword({ email }: ForgotPasswordDto) {
		//Find user
		const user = await this.userRepo.fetchByEmail(email);

		//TODO: If user found, then generate resetToken.
		const resetToken = user.map((u) => this.tokenServ.sign({ userId: u.id }));

		//TODO: Save this reset Token in the resetRequestTBl

		//TODO: Generate an email with the appended token and send it to the provided email.
	}

	async resetPassword({ token, newPassword }: ResetPasswordDto) {
		//TODO: Find token from resetRequest table from the db.
		//TODO: Find the user using the userID obtained from token.
		//TODO: Create a new Hash against the newPassword.
		//TODO: Update user password in the database.
	}

	// TODO: complete this
	async verifyUser() {}
}
