import { AppResult, Logger } from "@carbonteq/hexapp"
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common"
import { Observable, map } from "rxjs"
import { HttpResponse } from "./app-result.adapter.http"

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {
    logger.setContext(ResponseInterceptor.name)
  }

  intercept(
    _context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    return next.handle().pipe(
      map(res => {
        if (res instanceof AppResult) {
          if (res.isErr()) {
            this.logger.error(res.unwrapErr())
          }

          return HttpResponse.handleAppResult(res)
        }

        return res
      }),
    )
  }
}
