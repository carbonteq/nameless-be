import { drizzleConnFactory } from "./db-connection";
import { resetReqTbl } from "./models/reset-request.model";
import { userTbl } from "./models/user.model";
import { validationSchemaTbl } from "./models/validation-schema.model";
import { verifyReqTbl } from "./models/verify-request.model";

const resetDb = async () => {
	const db = drizzleConnFactory();

	console.time("Time for db ops");
	await db.delete(validationSchemaTbl);
	await db.delete(resetReqTbl);
	await db.delete(verifyReqTbl);
	await db.delete(userTbl);
	console.timeEnd("Time for db ops");

	console.debug("Done");
};

resetDb();
