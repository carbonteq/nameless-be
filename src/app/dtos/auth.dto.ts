import {
	BaseDto,
	type DtoValidationResult,
	Email,
	UUID,
} from "@carbonteq/hexapp";
import { Password, Username } from "@domain/refined/user.refined";
import z from "zod";

export class LoginDto extends BaseDto {
	private static readonly schema = z.object({
		email: Email,
		password: Password,
	});

	private constructor(
		readonly email: Email,
		readonly password: Password,
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
		username: Username,
		email: Email,
		password: Password,
	});

	private constructor(
		readonly username: Username,
		readonly email: Email,
		readonly password: Password,
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
		baseUrl: z.string().url(),
	});

	private constructor(
		readonly email: Email,
		readonly baseUrl: string,
	) {
		super();
	}

	static create(data: unknown): DtoValidationResult<ForgotPasswordDto> {
		return BaseDto.validate(ForgotPasswordDto.schema, data).map(
			({ email, baseUrl }) => new ForgotPasswordDto(email, baseUrl),
		);
	}
}

export class ResetPasswordDto extends BaseDto {
	private static readonly schema = z.object({
		reqId: UUID,
		newPassword: Password,
	});

	private constructor(
		readonly reqId: UUID,
		readonly newPassword: Password,
	) {
		super();
	}

	static create(data: unknown): DtoValidationResult<ResetPasswordDto> {
		return BaseDto.validate(ResetPasswordDto.schema, data).map(
			({ reqId, newPassword }) => new ResetPasswordDto(reqId, newPassword),
		);
	}
}