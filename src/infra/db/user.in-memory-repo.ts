import { PwHashingService } from "@app/services/pw-hashing.service";
import { Result } from "@carbonteq/fp";
import { Email, RepositoryResult } from "@carbonteq/hexapp";
import { SerializedUser, User } from "@domain/entities/user/user.entity";
import {
	InvalidCredentials,
	UserAlreadyExists,
	UserNotFound,
} from "@domain/entities/user/user.errors";
import { UserRepository } from "@domain/entities/user/user.repository";
import { v4 } from "@napi-rs/uuid";
import { Injectable, Provider } from "@nestjs/common";

@Injectable()
class InMemUserRepo extends UserRepository {
	#map: Map<User["email"], SerializedUser>;

	constructor(readonly pwHashServ: PwHashingService) {
		super();

		this.#map = new Map();

		const dummyUser = User.fromSerialized({
			id: v4(),
			createdAt: new Date(),
			updatedAt: new Date(),
			email: "test@dev.com" as Email,
			pwHashed: pwHashServ.hash("testpass"),
			username: "dummy",
		});

		this.#map.set(dummyUser.email, dummyUser.serialize());
	}

	update(entity: User): Promise<RepositoryResult<User, UserNotFound>> {
		throw new Error("Method not implemented.");
	}

	insert(entity: User): Promise<RepositoryResult<User, UserAlreadyExists>> {
		throw new Error("Method not implemented.");
	}

	fetchById(id: User["id"]): Promise<RepositoryResult<User, UserNotFound>> {
		throw new Error("Method not implemented.");
	}

	async fetchByEmail(
		email: User["email"],
	): Promise<RepositoryResult<User, InvalidCredentials>> {
		const userData = this.#map.get(email);

		if (!userData) return Result.Err(new InvalidCredentials());

		return Result.Ok(User.fromSerialized(userData));
	}
}

export const userRepoProvider: Provider<UserRepository> = {
	provide: UserRepository,
	useClass: InMemUserRepo,
};
