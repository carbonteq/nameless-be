import { resetReqTbl } from "./reset-request.model";
import { userTbl } from "./user.model";
import { verifyReqTbl } from "./verify-request.model";

const dbSchema = {
	users: userTbl,
	resetReq: resetReqTbl, // Shariq's fault
	verifyReqs: verifyReqTbl,
};

export default dbSchema;
