import "dotenv/config"
import * as env from "env-var"

const DROPBOX_KEY = env.get("DROPBOX_KEY").required().asString()
const DROPBOX_SECRET = env.get("DROPBOX_SECRET").required().asString()

export default { DROPBOX_KEY, DROPBOX_SECRET }
