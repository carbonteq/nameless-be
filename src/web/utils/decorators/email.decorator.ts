import { BaseDto, DtoValidationResult, Email } from "@carbonteq/hexapp"
import {
  type ArgumentMetadata,
  type PipeTransform,
  Query,
} from "@nestjs/common"

type DtoConstructor<U extends BaseDto> = (
  arg: unknown,
) => DtoValidationResult<U>

class ApplyDtoPipe<U extends BaseDto> implements PipeTransform<unknown, U> {
  constructor(private readonly dtoConst: DtoConstructor<U>) {}

  transform(value: unknown, _metadata: ArgumentMetadata): U {
    return this.dtoConst(value).unwrap()
  }
}

export const EmailParam = (queryName = "email") =>
  Query(queryName, new ApplyDtoPipe<Email>(Email.create))
