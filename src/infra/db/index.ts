import { Global, Module } from "@nestjs/common"
import { drizzleDbProvider } from "./drizzle/db-connection"
import { ResetRequestRepoProvider } from "./drizzle/repos/reset-request.drizzle-repo"
import { UserRepoProvider } from "./drizzle/repos/user.drizzle-repo"
import { ValidationSchemaRepoProvider } from "./drizzle/repos/validation-schema.drizzle-repo"
import { VerifyRequestRepoProvider } from "./drizzle/repos/verify-request.drizzle-repo"

const REPOS = [
  drizzleDbProvider,
  UserRepoProvider,
  ResetRequestRepoProvider,
  VerifyRequestRepoProvider,
  ValidationSchemaRepoProvider,
]

@Global()
@Module({ providers: REPOS, exports: REPOS })
export class DbModule {}
