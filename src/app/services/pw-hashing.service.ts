import type { UnitResult } from "@carbonteq/fp";
import type { InvalidCredentials } from "@domain/entities/auth-user/auth-user.errors";

export abstract class PwHashingService {
	abstract hash(plain: string): string;
	abstract compare(
		plain: string,
		hashed: string,
	): UnitResult<InvalidCredentials>;
}
