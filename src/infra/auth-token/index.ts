import {
	AuthTokenPayload,
	AuthTokenService,
	InvalidToken,
} from "@app/services/auth-token.service";
import { Result } from "@carbonteq/fp";
import { JwtCacheClient } from "@carbonteq/jwt";
import config from "@infra/config";
import { Injectable, Provider } from "@nestjs/common";

@Injectable()
class JwtService extends AuthTokenService {
	private readonly client: JwtCacheClient;

	constructor() {
		super();

		this.client = new JwtCacheClient(
			config.auth.TOKEN_SECRET,
			config.auth.TOKEN_EXPIRATION_SECONDS - 10,
			500,
		);
	}

	sign(payload: AuthTokenPayload): { token: string } {
		const token = this.client.sign(payload, { sub: payload.userId });

		return { token };
	}

	verify(token: string): Result<AuthTokenPayload, InvalidToken> {
		try {
			const claims = this.client.verify(token);

			return Result.Ok(claims.data as AuthTokenPayload);
		} catch (err) {
			return Result.Err(new InvalidToken());
		}
	}
}

export const AuthTokenServiceProvider: Provider<AuthTokenService> = {
	provide: AuthTokenService,
	useClass: JwtService,
};
