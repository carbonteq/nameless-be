import config from "@infra/config";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { Provider, Scope } from "@nestjs/common";
import dbSchema from "./models";

export const DRIZZLE_DB = Symbol.for("DRIZZLE");
export type DrizzleDb = NodePgDatabase<typeof dbSchema>;

export const drizzleConnFactory = () => {
	const pool = new Pool({
		connectionString: config.db.DB_URL,
		max: 25,
	});

	const db = drizzle(pool, {
		schema: dbSchema,
		logger: config.app.NODE_ENV === "DEV",
	});

	return db;
};

export const drizzleDbProvider: Provider<DrizzleDb> = {
	provide: DRIZZLE_DB,
	scope: Scope.DEFAULT,
	useFactory: drizzleConnFactory,
};
