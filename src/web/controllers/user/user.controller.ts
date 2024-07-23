import { EditProfileDto } from "@app/dtos/user.dto";
import { UserWorkflows } from "@app/workflows/user.workflow";
import { Body, Controller, Get, Post, Put, Req } from "@nestjs/common";
import { FastifyRequest } from "fastify";

@Controller("/users")
export class UserController {
	constructor(private readonly wfs: UserWorkflows) {}

	//TODO: Get method that is going to send the data for edit profile.

	@Put("/me")
	async editprofile(@Req() request: FastifyRequest, @Body() body: unknown) {
		const dto = EditProfileDto.create(body, request.user).unwrap();

		return this.wfs.editProfile(dto);
	}

	@Get("/me")
	async getProfile(@Req() request: FastifyRequest) {
		return this.wfs.getProfile(request.user);
	}
}
