import { Logger } from "@carbonteq/hexapp";
import config from "@infra/config";
import { configureApp, createApp } from "./configure";

async function bootstrap() {
	const app = await createApp();

	configureApp(app);

	const port = config.app.PORT;
	const host = config.app.NODE_ENV === "PROD" ? "0.0.0.0" : "127.0.0.1";

	await app.listen(port, host, async () => {
		const logger = await app.resolve(Logger);

		logger.info(`App is up at http://${host}:${port}`);
	});
}

bootstrap();
