import z from "zod";
import { parseJSON } from "date-fns/parseJSON";

const schema = z
	.union([z.number(), z.string(), z.date()])
	.transform((data, ctx) => {
		if (data instanceof Date) return data;

		if (data instanceof Number) return new Date(data);

		console.debug("here");

		const d = parseJSON(data);

		if (Number.isNaN(d.getTime())) {
			ctx.addIssue({
				code: "custom",
				message: "Invalid date string",
				params: data,
			});
			return z.NEVER;
		}

		return d;
	});

const actualSchema = z.object({
	dt: schema,
});

// console.debug(actualSchema.parse({ dt: "123456" }));
const obj = { b: undefined };
console.debug(obj.a);
