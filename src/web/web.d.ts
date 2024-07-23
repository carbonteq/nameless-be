import { User } from "@domain/entities/user/user.entity";

declare module "fastify" {
	interface FastifyRequest {
		user: User;
	}
	interface FastifyReply {}
}
