import * as relations from "./relations";
import { resetReqTbl } from "./reset-request.model";
import { userTbl } from "./user.model";
import { validationSchemaTbl } from "./validation-schema.model";
import { verifyReqTbl } from "./verify-request.model";

const dbSchema = {
	users: userTbl,
	resetReq: resetReqTbl, // Shariq's fault
	verifyReqs: verifyReqTbl,
	validationSchema: validationSchemaTbl,
	...relations, // ...spread syntax
};

export default dbSchema;
