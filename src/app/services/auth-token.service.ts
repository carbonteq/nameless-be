import type { Result } from "@carbonteq/fp";
import { UnauthorizedOperation } from "@carbonteq/hexapp";
import type { AuthRoleSerialized } from "@domain/refined/auth-role";

export interface AuthTokenPayload {
	authId: string;
	userId: string;
	role: AuthRoleSerialized;
}

export class InvalidToken extends UnauthorizedOperation {
	constructor() {
		super("Invalid/Expired token");
	}
}

export abstract class AuthTokenService {
	abstract sign(payload: AuthTokenPayload): { token: string };
	abstract verify(token: string): Result<AuthTokenPayload, InvalidToken>;
}
