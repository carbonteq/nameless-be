import { OAuthService } from "@app/services/oauth.service"
import { AppResult, UUID } from "@carbonteq/hexapp"
import { User } from "@domain/entities/user/user.entity"
import { UserRepository } from "@domain/entities/user/user.repository"
import { Injectable } from "@nestjs/common"

@Injectable()
export class DataStoreWorkflows {
  constructor(
    private readonly repo: UserRepository,
    private readonly oauthServ: OAuthService,
  ) {}

  async fetchConfig(user: User, { dropbox }: Record<"dropbox", string>) {
    return {
      dropbox: await this.oauthServ.getDropboxUri(dropbox, user.id),
    }
  }

  async handleDropboxCb(code: string, userId: UUID) {
    const user = await this.repo.fetchById(userId)

    const tokenResp = await user.map(user =>
      this.oauthServ.fetchDropboxToken(code),
    )

    return AppResult.Ok({ success: "ok" })
  }
}
