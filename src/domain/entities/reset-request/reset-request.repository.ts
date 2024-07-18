import { BaseRepository, type RepositoryResult } from "@carbonteq/hexapp";
import { ResetRequest } from "./reset-request.entity";

import { ResetRequestNotFound } from "./reset-request.errors";

export abstract class ResetRequestRepository extends BaseRepository<ResetRequest> {
	abstract insert(
		entity: ResetRequest,
	): Promise<RepositoryResult<ResetRequest>>;
	abstract fetchByToken(
		token: ResetRequest["token"],
	): Promise<RepositoryResult<ResetRequest, ResetRequestNotFound>>;
	// abstract fetchByUserId(
	//     userId: ResetRequest["userId"],
	// ): Promise<RepositoryResult<ResetRequest, ResetRequestNotFound>>;
}
