import { NotFoundError } from "@carbonteq/hexapp";
import { VerifyRequest } from "./verify-request.entity";

export class InvalidVerifyReq extends NotFoundError {
	constructor(id: VerifyRequest["id"]) {
		super(`Invalid Verify request <${id}>`);
	}
}
