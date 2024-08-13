import "dotenv/config"

import { LOG_LEVEL } from "@carbonteq/hexapp"
import * as env from "env-var"

const PORT: number = env.get("PORT").default(3000).asPortNumber()

const NODE_ENV_VALUE = env
  .get("NODE_ENV")
  .default("DEV")
  .asEnum(["DEV", "PROD", "test"])
const ENV_LOG_LEVEL = env
  .get("LOG_LEVEL")
  .default(LOG_LEVEL.DEBUG)
  .asEnum(Object.values(LOG_LEVEL))

export default {
  PORT,
  LOG_LEVEL: ENV_LOG_LEVEL,
  NODE_ENV: NODE_ENV_VALUE,
}
