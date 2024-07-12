import type { INestApplication } from "@nestjs/common";
import {
	FastifyAdapter,
	type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test, type TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { WebModule } from "./../src/web/web.module";

describe("AppController (e2e)", () => {
	let app: INestApplication;
	let agent: request.Agent;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [WebModule],
		}).compile();

		app = moduleFixture.createNestApplication<NestFastifyApplication>(
			new FastifyAdapter(),
			{
				rawBody: true,
			},
		);
		await app.init();
		await app.getHttpAdapter().getInstance().ready();

		agent = request.agent(app.getHttpServer());
	});

	it("/health (GET)", () => {
		return agent.get("/health").expect(200).expect({ up: true });
	});
});
