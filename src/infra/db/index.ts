import { Global, Module } from "@nestjs/common";
import { drizzleDbProvider } from "./drizzle/db-connection";
import { userRepoProvider } from "./user.in-memory-repo";

const REPOS = [userRepoProvider];

@Global()
@Module({ providers: REPOS, exports: REPOS })
export class DbModule {}
