import { PwHashingService } from "@app/services/pw-hashing.service";
import { Result, type UnitResult } from "@carbonteq/fp";
import { InvalidCredentials } from "@domain/entities/auth-user/auth-user.errors";
import config from "@infra/config";
import type { Provider } from "@nestjs/common";
import * as nodeArgon2 from "@node-rs/argon2";

export class ArgonPwHasher extends PwHashingService {
	private readonly SECRET: Buffer;

	constructor() {
		super();

		this.SECRET = Buffer.from(config.auth.PWD_HASH_SECRET, "hex");
	}

	hash(plain: string): string {
		return nodeArgon2.hashSync(plain, {
			secret: this.SECRET,
		});
	}

	compare(plain: string, hashed: string): UnitResult<InvalidCredentials> {
		const isValid = nodeArgon2.verifySync(hashed, plain, {
			secret: this.SECRET,
		});

		return isValid ? Result.UNIT_RESULT : Result.Err(new InvalidCredentials());
	}
}

export const HashingServiceProvider: Provider<PwHashingService> = {
	provide: PwHashingService,
	useClass: ArgonPwHasher,
};
