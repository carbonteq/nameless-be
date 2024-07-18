import { Result } from "@carbonteq/fp";
import type {
	BaseDto,
	DomainError,
	DtoValidationResult,
	ValidationError,
} from "@carbonteq/hexapp";
import {
	type ArgumentMetadata,
	Body,
	type PipeTransform,
} from "@nestjs/common";

type RefinedTypeFactory<T, E extends DomainError> = (
	arg: unknown,
) => Result<T, E>;
type RefinedErrTransformer<E, E2 extends DomainError> = (e: E) => E2;

export class ApplyRefinedPipe<
	T,
	E extends DomainError = ValidationError,
	E2 extends DomainError = E,
> implements PipeTransform<unknown, T>
{
	constructor(
		readonly factory: RefinedTypeFactory<T, E>,
		readonly errTransformer: RefinedErrTransformer<E, E2> | undefined,
	) {}

	transform(value: unknown, _metadata: ArgumentMetadata): T {
		const r = this.factory(value);

		if (this.errTransformer !== undefined)
			return r.mapErr(this.errTransformer).unwrap();

		return r.unwrap();
	}
}

type DtoFactory<U extends BaseDto> = (arg: unknown) => DtoValidationResult<U>;

interface DtoWithCreate<T extends BaseDto> {
	create: DtoFactory<T>;
}

export class ApplyDtoPipe<U extends BaseDto>
	implements PipeTransform<unknown, U>
{
	constructor(private readonly dtoConst: DtoFactory<U>) {}

	transform(value: unknown, _metadata: ArgumentMetadata): U {
		return this.dtoConst(value).unwrap();
	}
}

export const BodyDto = <T extends BaseDto>(dtoWithCreate: DtoWithCreate<T>) =>
	Body(new ApplyDtoPipe<T>(dtoWithCreate.create));
