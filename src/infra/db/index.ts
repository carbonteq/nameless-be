import { Global, Module } from "@nestjs/common";
import { drizzleDbProvider } from "./drizzle/db-connection";
import { ResetRequestRepoProvider } from "./drizzle/repos/reset-request.drizzle-repo";
import { UserRepoProvider } from "./drizzle/repos/user.drizzle-repo";

const REPOS = [drizzleDbProvider, UserRepoProvider, ResetRequestRepoProvider];

@Global()
@Module({ providers: REPOS, exports: REPOS })
export class DbModule {}
