import { BaseDto, type DtoValidationResult, Email } from "@carbonteq/hexapp";
import z from "zod";

export class LoginDto extends BaseDto {
	private static readonly schema = z.object({
		email: Email,
		password: z.string().min(1),
	});

	private constructor(
		readonly email: Email,
		readonly password: string,
	) {
		super();
	}

	static create(data: unknown): DtoValidationResult<LoginDto> {
		const res = BaseDto.validate(LoginDto.schema, data);

		return res.map(({ email, password }) => new LoginDto(email, password));
	}
}
