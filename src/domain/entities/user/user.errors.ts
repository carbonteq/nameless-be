import {
	AlreadyExistsError,
	NotFoundError,
	UnauthorizedOperation,
} from "@carbonteq/hexapp";
import { User } from "./user.entity";

export class UserNotFound extends NotFoundError {
	constructor(id: User["id"]) {
		super(`User with id <${id}> doesn't exist`);
	}
}

export class UserAlreadyExists extends AlreadyExistsError {
	constructor(
		readonly data: string,
		field: "email" | "username",
	) {
		super(`User with this ${field} already exists`);
	}
}

export class InvalidCredentials extends UnauthorizedOperation {
	constructor() {
		super("Invalid email/password");
	}
}
