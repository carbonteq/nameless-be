import type { LoginDto } from "@app/dtos/login.dto";
import { AuthTokenService } from "@app/services/auth-token.service";
import { PwHashingService } from "@app/services/pw-hashing.service";
import { AppResult } from "@carbonteq/hexapp";
import { UserRepository } from "@domain/entities/user/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthWorkflows {
	constructor(
		private readonly pwHashServ: PwHashingService,
		private readonly tokenServ: AuthTokenService,
		private readonly userRepo: UserRepository,
	) {}

	async login({ email, password }: LoginDto) {
		const userRes = await this.userRepo.fetchByEmail(email);

		const tokenRes = userRes
			.bindErr((user) => this.pwHashServ.compare(password, user.pwHashed))
			.map((user) => this.tokenServ.sign({ userId: user.id }));

		return AppResult.fromResult(tokenRes);
	}
}
