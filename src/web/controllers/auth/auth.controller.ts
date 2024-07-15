import { LoginDto, SignUpDto } from "@app/dtos/auth.dto";
import { AuthWorkflows } from "@app/workflows/auth.workflows";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";

@Controller("/auth")
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
}
