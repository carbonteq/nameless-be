import "dotenv/config"
import appConfig from "./app.config"
import authConfig from "./auth.config"
import dbConfig from "./db.config"

export default { app: appConfig, db: dbConfig, auth: authConfig }
