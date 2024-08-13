import "dotenv/config"
import * as env from "env-var"

const PWD_HASH_SECRET = env.get("PWD_HASH_SECRET").required().asString()
const TOKEN_SECRET = env.get("TOKEN_SECRET").required().asString()
const TOKEN_EXPIRATION_SECONDS = env
  .get("TOKEN_EXPIRATION_SECONDS")
  .required()
  .asIntPositive()

export default { PWD_HASH_SECRET, TOKEN_EXPIRATION_SECONDS, TOKEN_SECRET }
