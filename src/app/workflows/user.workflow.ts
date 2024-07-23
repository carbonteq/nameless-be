import type { EditProfileDto } from "@app/dtos/user.dto";
import { PwHashingService } from "@app/services/pw-hashing.service";
import { AppResult } from "@carbonteq/hexapp";
import { User } from "@domain/entities/user/user.entity";
import { UserRepository } from "@domain/entities/user/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserWorkflows {
	constructor(
		private readonly userRepo: UserRepository,
		private readonly pwHashServ: PwHashingService,
	) {}

	private async persistupdatePasswordEnts(user: User) {
		await this.userRepo.update(user);
	}
	async editProfile({ user, newPassword }: EditProfileDto) {
		const newPwHash = this.pwHashServ.hash(newPassword);
		const updatedUser = user.passwordUpdate(newPwHash);

		this.persistupdatePasswordEnts(updatedUser);

		return AppResult.Ok({
			message: "Password Updated Succesfully.",
		});
	}

	async getProfile(user: User) {
		const { email, username } = user;
		return AppResult.Ok({
			email: user.email,
		});
	}
}
