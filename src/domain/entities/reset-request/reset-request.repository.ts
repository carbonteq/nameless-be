import { BaseRepository, type RepositoryResult } from "@carbonteq/hexapp"
import { ResetRequest } from "./reset-request.entity"

import { InvalidResetReq } from "./reset-request.errors"

export abstract class ResetRequestRepository extends BaseRepository<ResetRequest> {
  abstract insert(entity: ResetRequest): Promise<RepositoryResult<ResetRequest>>
  abstract fetchById(
    id: ResetRequest["id"],
  ): Promise<RepositoryResult<ResetRequest, InvalidResetReq>>
  abstract update(
    entity: ResetRequest,
  ): Promise<RepositoryResult<ResetRequest, InvalidResetReq>>
}
