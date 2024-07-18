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

export class SignUpDto extends BaseDto {
	private static readonly schema = z.object({
		username: z.string().min(5),
		email: Email,
		password: z.string().min(1),
	});

	private constructor(
		readonly username: string,
		readonly email: Email,
		readonly password: string,
	) {
		super();
	}

	static create(data: unknown): DtoValidationResult<SignUpDto> {
		return BaseDto.validate(SignUpDto.schema, data).map(
			({ email, password, username }) =>
				new SignUpDto(username, email, password),
		);
	}
}

export class ForgotPasswordDto extends BaseDto {
	private static readonly schema = z.object({
		email: Email,
	});

	private constructor(readonly email: Email) {
		super();
	}

	static create(data: unknown): DtoValidationResult<ForgotPasswordDto> {
		return BaseDto.validate(ForgotPasswordDto.schema, data).map(
			({ email }) => new ForgotPasswordDto(email),
		);
	}
}

export class ResetPasswordDto extends BaseDto {
	private static readonly schema = z.object({
		token: z.string().min(1),
		newPassword: z.string().min(1),
	});

	private constructor(
		readonly token: string,
		readonly newPassword: string,
	) {
		super();
	}

	static create(data: unknown): DtoValidationResult<ResetPasswordDto> {
		return BaseDto.validate(ResetPasswordDto.schema, data).map(
			({ token, newPassword }) => new ResetPasswordDto(token, newPassword),
		);
	}
}
