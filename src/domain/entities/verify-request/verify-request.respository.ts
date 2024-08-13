import { BaseRepository, type RepositoryResult } from "@carbonteq/hexapp"
import { VerifyRequest } from "./verify-request.entity"

import { InvalidVerifyReq } from "./verify-request.errors"

export abstract class VerifyRequestRepository extends BaseRepository<VerifyRequest> {
  abstract insert(
    entity: VerifyRequest,
  ): Promise<RepositoryResult<VerifyRequest>>
  abstract fetchById(
    id: VerifyRequest["id"],
  ): Promise<RepositoryResult<VerifyRequest, InvalidVerifyReq>>
  abstract update(
    entity: VerifyRequest,
  ): Promise<RepositoryResult<VerifyRequest, InvalidVerifyReq>>
}
