import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/infra/db/drizzle/models/*.model.ts",
	out: "./migrations",
	dbCredentials: {
		url: process.env.DB_URL as string,
	},
});
