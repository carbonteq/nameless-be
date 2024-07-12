import { Global, Module } from "@nestjs/common";
import { drizzleDbProvider } from "./drizzle/db-connection";
import { AuthUserRepoProvider } from "./drizzle/repos/auth-user.drizzle-repo";
import { TechnicianRepoProvider } from "./drizzle/repos/technician.drizzle-repo";

const REPOS = [drizzleDbProvider, AuthUserRepoProvider, TechnicianRepoProvider];

@Global()
@Module({ providers: REPOS, exports: REPOS })
export class DbModule {}
