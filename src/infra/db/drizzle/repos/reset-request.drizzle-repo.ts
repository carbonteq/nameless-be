import { Result } from "@carbonteq/fp";
import { RepositoryResult } from "@carbonteq/hexapp";
import { ResetRequest } from "@domain/entities/reset-request/reset-request.entity";
import { ResetRequestNotFound } from "@domain/entities/reset-request/reset-request.errors";
import { ResetRequestRepository } from "@domain/entities/reset-request/reset-request.repository";
import { Injectable, Provider } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DrizzleDb, InjectDb } from "../db-connection";
import { resetRequestTbl } from "../models/reset-request.model";
import { handleDrizzleErr } from "../utils";

@Injectable()
class ResetRequestDrizzleRepo extends ResetRequestRepository {
	constructor(@InjectDb() private readonly db: DrizzleDb) {
		super();
	}

	async insert(
		resetRequest: ResetRequest,
	): Promise<RepositoryResult<ResetRequest>> {
		const data = resetRequest.serialize();
		try {
			await this.db.insert(resetRequestTbl).values(data);

			return Result.Ok(resetRequest);
		} catch (err) {
			//If there already exists a request for this userId or token, replace that one with the current one
			//To prevent a user from opening multiple resetRequests.

			return handleDrizzleErr(err, {
				UniqueConstaintViolation: (e) => {
					const isUsernameErr = e.message.includes("username");

					// const [identifier, field] = isUsernameErr
					//     ? ([resetRequest.userId, "username"] as const)
					//     : ([resetRequest.email, "email"] as const);

					return Result.Err(new Error());
				},
			});
		}
	}

	async fetchByToken(
		token: ResetRequest["token"],
	): Promise<RepositoryResult<ResetRequest, ResetRequestNotFound>> {
		const data = await this.db.query.reset_request.findFirst({
			where: eq(resetRequestTbl.token, token),
		});

		if (!data) return Result.Err(new ResetRequestNotFound(token));

		return Result.Ok(ResetRequest.fromSerialized(data));
	}
}

export const ResetRequestRepoProvider: Provider<ResetRequestRepository> = {
	provide: ResetRequestRepository,
	useClass: ResetRequestDrizzleRepo,
};
