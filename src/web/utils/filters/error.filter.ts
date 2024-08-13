import {
  AppErrStatus,
  AppError,
  type Logger as AppLogger,
  DtoValidationError,
  handleZodErr,
} from "@carbonteq/hexapp"
import { type ArgumentsHost, Catch, type ExceptionFilter } from "@nestjs/common"
import type {
  // FastifyRequest as Request,
  FastifyReply as Response,
} from "fastify"
import { ZodError } from "zod"

@Catch(Error)
export class ErrorFilter implements ExceptionFilter<Error> {
  constructor(private readonly logger: AppLogger) {
    logger.setContext("ErrorFilter")
  }

  catch(err: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    // const req = ctx.getRequest<Request>();
    const resp = ctx.getResponse<Response>()

    //@ts-ignore
    this.logger.debug(err.code)
    this.logger.error(err, err.stack)

    if (err instanceof DtoValidationError) {
      return handleError(AppError.InvalidData(err.message), resp)
    }

    if (err instanceof ZodError) {
      return handleError(AppError.InvalidData(handleZodErr(err).message), resp)
    }

    if (err instanceof AppError) {
      return handleError(err, resp)
    }

    throw err // so that it can be handled by others
  }
}

const CODE_TO_STATUS = new Map<string, number>([
  [AppErrStatus.AlreadyExists, 400],
  [AppErrStatus.Generic, 500],
  [AppErrStatus.GuardViolation, 400],
  [AppErrStatus.InvalidData, 422],
  [AppErrStatus.InvalidOperation, 400],
  [AppErrStatus.NotFound, 404],
  [AppErrStatus.Unauthorized, 401],
])

const handleError = (err: AppError, resp: Response) => {
  const status = CODE_TO_STATUS.get(err.status) || 400
  const body = { code: err.status, description: err.message }

  return resp.status(status).send(body)
}
