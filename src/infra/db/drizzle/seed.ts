import { Email } from "@carbonteq/hexapp";
import config from "@infra/config";
import { ArgonPwHasher } from "@infra/pwhashing";
import { drizzleConnFactory } from "./db-connection";
import { userTbl } from "./models/user.model";

const seed = async () => {
	const db = drizzleConnFactory();
	const pwHashServ = new ArgonPwHasher();

	const pwHashed = pwHashServ.hash(config.db.SEED_PWD);

	const devUsers: Array<typeof userTbl.$inferInsert> = [
		{ username: "devguy", email: "dev@nameless.gg" as Email, pwHashed },
		{ username: "intern", email: "intern@nameless.gg" as Email, pwHashed },
	];

	console.time("Time for db ops");
	await db.insert(userTbl).values(devUsers);
	console.timeEnd("Time for db ops");

	console.debug("Done");
};

seed();
