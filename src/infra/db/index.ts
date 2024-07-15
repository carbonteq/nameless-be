import { Global, Module } from "@nestjs/common";
import { drizzleDbProvider } from "./drizzle/db-connection";
import { UserRepoProvider } from "./drizzle/repos/user.drizzle-repo";

const REPOS = [drizzleDbProvider, UserRepoProvider];

@Global()
@Module({ providers: REPOS, exports: REPOS })
export class DbModule {}
