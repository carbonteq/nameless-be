import { Result } from "@carbonteq/fp"
import { RepositoryResult } from "@carbonteq/hexapp"
import { VerifyRequest } from "@domain/entities/verify-request/verify-request.entity"
import { InvalidVerifyReq } from "@domain/entities/verify-request/verify-request.errors"
import { VerifyRequestRepository } from "@domain/entities/verify-request/verify-request.respository"
import { Injectable, Provider } from "@nestjs/common"
import { eq } from "drizzle-orm"
import { DrizzleDb, InjectDb } from "../db-connection"
import { verifyReqTbl } from "../models/verify-request.model"

@Injectable()
class VerifyRequestDrizzleRepo extends VerifyRequestRepository {
  constructor(@InjectDb() private readonly db: DrizzleDb) {
    super()
  }

  async insert(
    verifyRequest: VerifyRequest,
  ): Promise<RepositoryResult<VerifyRequest>> {
    const data = verifyRequest.serialize()

    await this.db.insert(verifyReqTbl).values(data)

    return Result.Ok(verifyRequest)
  }

  async fetchById(
    id: VerifyRequest["id"],
  ): Promise<RepositoryResult<VerifyRequest, InvalidVerifyReq>> {
    const data = await this.db.query.verifyReqs.findFirst({
      where: eq(verifyReqTbl.id, id),
    })

    if (!data) return Result.Err(new InvalidVerifyReq(id))

    return Result.Ok(VerifyRequest.fromSerialized(data))
  }

  async update(
    verifyReq: VerifyRequest,
  ): Promise<RepositoryResult<VerifyRequest, InvalidVerifyReq>> {
    const data = verifyReq.forUpdate()

    await this.db
      .update(verifyReqTbl)
      .set(data)
      .where(eq(verifyReqTbl.id, verifyReq.id))

    return Result.Ok(verifyReq)
  }
}

export const VerifyRequestRepoProvider: Provider<VerifyRequestRepository> = {
  provide: VerifyRequestRepository,
  useClass: VerifyRequestDrizzleRepo,
}
