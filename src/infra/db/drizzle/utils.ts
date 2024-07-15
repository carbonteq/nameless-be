import { BaseEntity, RepositoryResult } from "@carbonteq/hexapp";

interface DrizzleErr extends Error {
	code: "23505";
}

export const isDrizzleErr = (e: unknown): e is DrizzleErr =>
	/* @ts-ignore*/
	e instanceof Error && e.code !== undefined;

type DrizzleErrHandlerNames = "UniqueConstaintViolation";
type DrizzleErrHandler<T extends BaseEntity> = (
	err: DrizzleErr,
) => RepositoryResult<T>;

export const handleDrizzleErr = <
	Ent extends BaseEntity,
	T extends Record<DrizzleErrHandlerNames, DrizzleErrHandler<Ent>>,
>(
	err: unknown,
	handlers: T,
) => {
	if (isDrizzleErr(err)) {
		switch (err.code) {
			case "23505":
				return handlers.UniqueConstaintViolation(err);
			default:
				throw err;
		}
	}

	throw err;
};
