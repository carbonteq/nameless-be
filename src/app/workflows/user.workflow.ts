import type { EditProfileDto } from "@app/dtos/user.dto";
import { AppResult } from "@carbonteq/hexapp";
import { User } from "@domain/entities/user/user.entity";
import { UserRepository } from "@domain/entities/user/user.repository";
import { UserDomainService } from "@domain/services/user.domain-service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserWorkflows {
	constructor(
		private readonly userRepo: UserRepository,
		private readonly domServ: UserDomainService,
	) {}

	private async persisteditProfileEnts(user: User) {
		await this.userRepo.update(user);
	}

	async editProfile({ user, newPassword, newEmail }: EditProfileDto) {
		const updatedUser = this.domServ.update(user, newPassword, newEmail);

		this.persisteditProfileEnts(updatedUser);

		return AppResult.Ok({
			message: "Resource updated successfully.",
		});
	}

	async getProfile(user: User) {
		return AppResult.Ok({
			username: user.userName,
			email: user.email,
			isVerified: user.isVerified,
		});
	}
}
