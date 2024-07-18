import {
	AlreadyExistsError,
	NotFoundError,
	UnauthorizedOperation,
} from "@carbonteq/hexapp";
import { ResetRequest } from "./reset-request.entity";

export class ResetRequestNotFound extends NotFoundError {
	constructor(token: ResetRequest["token"]) {
		super(`Reset Request again token ${token} doesn't exists.`);
	}
}

// export class UserAlreadyExists extends AlreadyExistsError {
//     constructor(
//         readonly data: string,
//         field: "email" | "username",
//     ) {
//         super(`User with this ${field} already exists`);
//     }
// }

// export class InvalidCredentials extends UnauthorizedOperation {
//     constructor() {
//         super("Invalid email/password");
//     }
// }
