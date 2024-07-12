import config from "@infra/config";
import { ArgonPwHasher } from "@infra/pwhashing";
import { drizzleConnFactory } from "./db-connection";

const seed = async () => {
	const db = drizzleConnFactory();
	const pwHashServ = new ArgonPwHasher();

	const pwHashed = pwHashServ.hash(config.db.SEED_PWD);

	console.time("Time for db ops");
	console.timeEnd("Time for db ops");

	console.debug("Done");
};

seed();
