import { resetReqTbl } from "./reset-request.model";
import { userTbl } from "./user.model";

const dbSchema = {
	users: userTbl,
	resetReq: resetReqTbl, // Shariq's fault
};

export default dbSchema;
