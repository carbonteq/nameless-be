import type { Result } from "@carbonteq/fp";
import { UnauthorizedOperation } from "@carbonteq/hexapp";

export interface AuthTokenPayload {
	userId: string;
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
