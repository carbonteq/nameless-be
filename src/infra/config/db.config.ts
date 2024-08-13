import "dotenv/config"
import * as env from "env-var"

const DB_URL = env.get("DB_URL").required().asUrlString()
const SEED_PWD = env.get("SEED_PWD").required().asString()

export default {
  DB_URL,
  SEED_PWD,
}
