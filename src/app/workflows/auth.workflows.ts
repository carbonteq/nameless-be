import type {
	ForgotPasswordDto,
	LoginDto,
	ResetPasswordDto,
	SignUpDto,
	VerifyDto,
} from "@app/dtos/auth.dto";
import { AuthTokenService } from "@app/services/auth-token.service";
import { EmailService } from "@app/services/email.service";
import { PwHashingService } from "@app/services/pw-hashing.service";
import { AppResult } from "@carbonteq/hexapp";
import { ResetRequest } from "@domain/entities/reset-request/reset-request.entity";
import { ResetRequestRepository } from "@domain/entities/reset-request/reset-request.repository";
import { User } from "@domain/entities/user/user.entity";
import { UserRepository } from "@domain/entities/user/user.repository";
import { VerifyRequest } from "@domain/entities/verify-request/verify-request.entity";
import { VerifyRequestRepository } from "@domain/entities/verify-request/verify-request.respository";
import { AuthDomainService } from "@domain/services/auth.domain-service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthWorkflows {
	constructor(
		private readonly pwHashServ: PwHashingService,
		private readonly tokenServ: AuthTokenService,
		private readonly userRepo: UserRepository,
		private readonly resetRequestRepo: ResetRequestRepository,
		private readonly emailServ: EmailService,
		private readonly authDomServ: AuthDomainService,
		private readonly verifyRequestRepo: VerifyRequestRepository,
	) {}

	async login({ email, password }: LoginDto) {
		const userRes = await this.userRepo.fetchByEmail(email);

		const tokenRes = userRes
			.bindErr((user) => this.pwHashServ.compare(password, user.pwHashed))
			.map((user) => this.tokenServ.sign({ userId: user.id }));

		return AppResult.fromResult(tokenRes);
	}

	async signup({ email, password, username, baseUrl }: SignUpDto) {
		const pwHashed = this.pwHashServ.hash(password);

		const user = await this.userRepo.insert(
			User.new(username, email, pwHashed),
		);

		const verifyReq = await user
			.map(VerifyRequest.forUser)
			.bind((req) => this.verifyRequestRepo.insert(req));

		const _emailRes = await verifyReq.map((req) =>
			this.emailServ.sendVerificationLink(email, baseUrl, req.id),
		);

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

	private async persistPasswordUpdateEnts(req: ResetRequest, user: User) {
		const updatedUser = await this.userRepo.update(user);
		const updatedReq = await updatedUser.zip(() =>
			this.resetRequestRepo.update(req),
		);

		return updatedReq;
	}

	async resetPassword({ reqId, newPassword }: ResetPasswordDto) {
		const resReqRes = await this.resetRequestRepo.fetchById(reqId);
		const userRes = await resReqRes.zip((token) =>
			this.userRepo.fetchById(token.userId),
		);

		const pwHashed = this.pwHashServ.hash(newPassword);

		const updateRes = await userRes
			.bind(([req, user]) =>
				this.authDomServ.updatePassword(req, user, pwHashed),
			)
			.bind(([req, user]) => this.persistPasswordUpdateEnts(req, user));

		const presentationRes = updateRes.map(() => ({
			message:
				"Your password has been successfully reset. You may now login using your new password.",
		}));
		return AppResult.fromResult(presentationRes);
	}

	private async persistVerificationEnts(req: VerifyRequest, user: User) {
		const updatedUser = await this.userRepo.update(user);
		const updatedReq = await updatedUser.zip(() =>
			this.verifyRequestRepo.update(req),
		);

		return updatedReq;
	}

	async verifyUser({ ticketID }: VerifyDto) {
		const verifyReqRes = await this.verifyRequestRepo.fetchById(ticketID);
		const userRes = await verifyReqRes.zip((token) =>
			this.userRepo.fetchById(token.userId),
		);

		const updateRes = await userRes
			.bind(([req, user]) => this.authDomServ.verifyUser(req, user))
			.bind(([req, user]) => this.persistVerificationEnts(req, user));

		const presentationRes = updateRes.map(() => ({
			message: "Your account has been succesfully activated.",
		}));
		return AppResult.fromResult(presentationRes);
	}
}
