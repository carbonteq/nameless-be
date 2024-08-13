import {
  AppErrStatus,
  AppResult,
  DtoValidationError,
  assertUnreachablePassthrough,
} from "@carbonteq/hexapp"
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common"

export interface HttpResponseData<T> {
  data: T
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class HttpResponse {
  private static processError(r: AppResult<never>): never {
    const err = r.unwrapErr()
    const errMsg = err.message

    switch (err.status) {
      case AppErrStatus.NotFound:
        throw new NotFoundException(errMsg, { cause: err })
      case AppErrStatus.InvalidData:
        throw new UnprocessableEntityException(errMsg, { cause: err })
      case AppErrStatus.Unauthorized:
        throw new UnauthorizedException(errMsg, { cause: err })
      case AppErrStatus.AlreadyExists:
        throw new ConflictException(errMsg, { cause: err })
      case AppErrStatus.InvalidOperation:
        throw new BadRequestException(errMsg, { cause: err })
      case AppErrStatus.GuardViolation:
        throw new BadRequestException(errMsg, { cause: err })
      case AppErrStatus.Generic:
        throw new InternalServerErrorException(errMsg, { cause: err })
      default:
        assertUnreachablePassthrough(err.status)
        throw new NotImplementedException(
          `Well, this is embarrassing. We don't know what error this is: "${errMsg}"`,
        )
    }
  }

  static handleAppResult<T>(res: AppResult<T>): T {
    if (res.isErr()) {
      HttpResponse.processError(res)
    } else {
      return res.unwrap()
    }
  }

  static handleError(err: unknown) {
    if (err instanceof DtoValidationError) {
      return new UnprocessableEntityException(err.message)
    }

    return err
  }
}
