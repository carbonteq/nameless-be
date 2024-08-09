import {
	ForgotPasswordDto,
	LoginDto,
	ResetPasswordDto,
	SignUpDto,
	VerifyDto,
} from "@app/dtos/auth.dto";
import { AuthWorkflows } from "@app/workflows/auth.workflows";
import { Body, Controller, HttpCode, Post, Put } from "@nestjs/common";
import { Public } from "@web/utils/decorators/public.decorator";

@Public()
@Controller("/api/auth")
export class AuthController {
	constructor(private readonly wfs: AuthWorkflows) {}

	@Post("/login")
	@HttpCode(200)
	async login(@Body() body: unknown) {
		const dto = LoginDto.create(body).unwrap();

		return await this.wfs.login(dto);
	}

	@Post("/register")
	async signUp(@Body() body: unknown) {
		const dto = SignUpDto.create(body).unwrap();

		return await this.wfs.signup(dto);
	}

	@Post("/forgot-password")
	async forgotpassword(@Body() body: unknown) {
		const dto = ForgotPasswordDto.create(body).unwrap();

		return await this.wfs.forgotPassword(dto);
	}

	@Put("/reset-password")
	async resetpassword(@Body() body: unknown) {
		const dto = ResetPasswordDto.create(body).unwrap();

		return await this.wfs.resetPassword(dto);
	}

	@Put("/verify")
	async verifyUser(@Body() body: unknown) {
		const dto = VerifyDto.create(body).unwrap();

		return await this.wfs.verifyUser(dto);
	}
}
