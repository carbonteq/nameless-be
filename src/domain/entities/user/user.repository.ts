import { BaseRepository, type RepositoryResult } from "@carbonteq/hexapp";
import { User } from "./user.entity";
import {
	InvalidCredentials,
	UserAlreadyExists,
	UserNotFound,
} from "./user.errors";

export abstract class UserRepository extends BaseRepository<User> {
	abstract update(entity: User): Promise<RepositoryResult<User, UserNotFound>>;
	abstract insert(
		entity: User,
	): Promise<RepositoryResult<User, UserAlreadyExists>>;
	abstract fetchById(
		id: User["id"],
	): Promise<RepositoryResult<User, UserNotFound>>;
	abstract fetchByEmail(
		email: User["email"],
	): Promise<RepositoryResult<User, InvalidCredentials>>;
}
