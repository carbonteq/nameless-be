import { NotFoundError } from "@carbonteq/hexapp"
import { ResetRequest } from "./reset-request.entity"

export class InvalidResetReq extends NotFoundError {
  constructor(id: ResetRequest["id"]) {
    super(`Invalid reset request <${id}>`)
  }
}
