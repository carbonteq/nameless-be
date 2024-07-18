import { Result } from "@carbonteq/fp";
import { NotFoundError, RepositoryResult } from "@carbonteq/hexapp";
import { ResetRequest } from "@domain/entities/reset-request/reset-request.entity";
import { InvalidResetReq } from "@domain/entities/reset-request/reset-request.errors";
import { ResetRequestRepository } from "@domain/entities/reset-request/reset-request.repository";
import { Injectable, Provider } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DrizzleDb, InjectDb } from "../db-connection";
import { resetReqTbl } from "../models/reset-request.model";

@Injectable()
class ResetRequestDrizzleRepo extends ResetRequestRepository {
	constructor(@InjectDb() private readonly db: DrizzleDb) {
		super();
	}

	async insert(
		resetRequest: ResetRequest,
	): Promise<RepositoryResult<ResetRequest>> {
		const data = resetRequest.serialize();

		await this.db.insert(resetReqTbl).values(data);

		return Result.Ok(resetRequest);
	}

	async fetchById(
		id: ResetRequest["id"],
	): Promise<RepositoryResult<ResetRequest, InvalidResetReq>> {
		const data = await this.db.query.resetReq.findFirst({
			where: eq(resetReqTbl.id, id),
		});

		if (!data) return Result.Err(new InvalidResetReq(id));

		return Result.Ok(ResetRequest.fromSerialized(data));
	}

	update(
		entity: ResetRequest,
	): Promise<RepositoryResult<ResetRequest, NotFoundError>> {
		throw new Error("Method not implemented.");
	}
}

export const ResetRequestRepoProvider: Provider<ResetRequestRepository> = {
	provide: ResetRequestRepository,
	useClass: ResetRequestDrizzleRepo,
};