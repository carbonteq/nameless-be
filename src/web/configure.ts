import config from "@infra/config";
import type { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	type NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { PinoAppLogger } from "@infra/logger/pino.logger";
import { ErrorFilter } from "./utils/filters/error.filter";
import { ResponseInterceptor } from "./utils/interceptors/response.interceptor";
import { WebModule } from "./web.module";

// Shared instrumentation
export const createApp = (): Promise<NestFastifyApplication> => {
	const adapter = new FastifyAdapter({});

	// adapter.register(plugin, pluginOpts)

	const app = NestFactory.create<NestFastifyApplication>(WebModule, adapter, {
		bufferLogs: true,
		rawBody: true,
	});

	return app;
};

export const configureApp = (app: INestApplication) => {
	app.useGlobalInterceptors(
		new ResponseInterceptor(PinoAppLogger.createLogger()),
	);
	app.useGlobalFilters(new ErrorFilter(PinoAppLogger.createLogger()));
};
