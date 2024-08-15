import { UUID } from "@carbonteq/hexapp"
import config from "@infra/config"
import { Injectable } from "@nestjs/common"
import { DropboxAuth } from "dropbox"

@Injectable()
export class OAuthService {
  dropbox: DropboxAuth

  constructor() {
    this.dropbox = new DropboxAuth({
      clientId: config.dataStore.DROPBOX_KEY,
      clientSecret: config.dataStore.DROPBOX_SECRET,
    })
  }

  async getDropboxUri(dropboxCbPth: string, userId: UUID) {
    const redirectUri = `${config.app.BASE_URI}${dropboxCbPth}`

    const url = await this.dropbox.getAuthenticationUrl(
      redirectUri,
      userId,
      "code",
      "offline",
    )

    return url
  }

  async fetchDropboxToken(code: string) {
    const { result } = await this.dropbox.getAccessTokenFromCode(
      `${config.app.BASE_URI}/api/datastore/callback/dropbox`,
      code,
    )

    console.debug(result)

    return { accessToken: "", refreshToken: "" }
  }
}
