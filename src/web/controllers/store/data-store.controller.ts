import { DataStoreWorkflows } from "@app/workflows/data-store.workflows"
import { UUID } from "@carbonteq/hexapp"
import { Controller, Get, Query, Req } from "@nestjs/common"
import { Public } from "@web/utils/decorators/public.decorator"
import { FastifyRequest } from "fastify"

@Controller("/api/datastore")
export class DatastoreController {
  constructor(private readonly wfs: DataStoreWorkflows) {}

  @Get("/config")
  async getConfig(@Req() req: FastifyRequest) {
    return this.wfs.fetchConfig(req.user, {
      dropbox: "/api/datastore/callback/dropbox",
    })
  }

  @Public()
  @Get("/callback/dropbox")
  async dropboxCallback(
    @Query("code") code: string,
    @Query("state") userId: string,
  ) {
    const userIdUUID = UUID.create(userId).unwrap()

    return await this.wfs.handleDropboxCb(code, userIdUUID)
  }
}
