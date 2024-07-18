import { createRefinedType } from "@carbonteq/hexapp";
import z from "zod";

export const Username = createRefinedType(
	Symbol.for("Username"),
	z.string().min(5),
);
// 	fromUnsafe: unsafeCast<string, typeof Username.$infer>,
export type Username = typeof Username.$infer;

export const Password = createRefinedType(
	Symbol.for("Password"),
	z
		.string()
		.min(9, { message: "Password must be longer than 8 characters" })
		.refine((password) => /[a-z]/.test(password), {
			message: "Password must contain at least one lowercase letter",
		})
		.refine((password) => /[A-Z]/.test(password), {
			message: "Password must contain at least one uppercase letter",
		})
		.refine((password) => /\d/.test(password), {
			message: "Password must contain at least one number",
		})
		.refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
			message: "Password must contain at least one special character",
		}),
);
export type Password = typeof Password.$infer;
