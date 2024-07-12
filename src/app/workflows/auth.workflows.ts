import type { LoginDto } from "@app/dtos/login.dto";
import { AuthTokenService } from "@app/services/auth-token.service";
import { PwHashingService } from "@app/services/pw-hashing.service";
import { AuthUserRepository } from "@domain/entities/auth-user/auth-user.repository";
import { TechnicianRepository } from "@domain/entities/technician/technician.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthWorkflows {
	constructor(
		private readonly pwHashServ: PwHashingService,
		private readonly tokenServ: AuthTokenService,
		private readonly repo: AuthUserRepository,
		private readonly technicianRepo: TechnicianRepository,
	) {}

	async login({ email, password }: LoginDto) {}
}
