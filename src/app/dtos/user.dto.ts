import { BaseDto, type DtoValidationResult, Email } from "@carbonteq/hexapp";
import { User } from "@domain/entities/user/user.entity";
import { Password } from "@domain/refined/user.refined";
import z from "zod";

export class EditProfileDto extends BaseDto {
	private static readonly schema = z
		.object({
			newPassword: Password.optional(),
			newEmail: Email.optional(),
		})
		.refine(
			(data) => data.newPassword !== undefined || data.newEmail !== undefined,
			{ message: "At least one of newPassword or newEmail must be specified." },
		);

	private constructor(
		readonly user: User,
		readonly newEmail?: Email,
		readonly newPassword?: Password,
	) {
		super();
	}

	static create(
		data: unknown,
		user: User,
	): DtoValidationResult<EditProfileDto> {
		return BaseDto.validate(EditProfileDto.schema, data).map(
			({ newPassword: password, newEmail: email }) =>
				new EditProfileDto(user, email, password),
		);
	}
}
