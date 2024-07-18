import { resetRequestTbl } from "./reset-request.model";
import { userTbl } from "./user.model";

const dbSchema = {
	users: userTbl,
	reset_request: resetRequestTbl,
};

export default dbSchema;
