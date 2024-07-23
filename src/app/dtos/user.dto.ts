import { BaseDto, type DtoValidationResult } from "@carbonteq/hexapp";
import { User } from "@domain/entities/user/user.entity";
import { Password } from "@domain/refined/user.refined";
import z from "zod";

export class EditProfileDto extends BaseDto {
	private static readonly schema = z.object({
		newPassword: Password,
	});

	private constructor(
		readonly newPassword: Password,
		readonly user: User,
	) {
		super();
	}

	static create(
		data: unknown,
		user: User,
	): DtoValidationResult<EditProfileDto> {
		return BaseDto.validate(EditProfileDto.schema, data).map(
			({ newPassword: password }) => new EditProfileDto(password, user),
		);
	}
}
