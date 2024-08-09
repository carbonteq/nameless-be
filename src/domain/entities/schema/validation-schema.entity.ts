import {
	BaseEntity,
	type IEntity,
	SimpleSerialized,
	UUID,
} from "@carbonteq/hexapp";
import { SchemaVo } from "@domain/value-objects/schema.vo";
import { User } from "../user/user.entity";

export interface IValidationSchema extends IEntity {
	belongsTo: UUID;
	schema: SchemaVo;
}

export type SerializedValidationSchema = SimpleSerialized<
	IValidationSchema,
	"schema"
> & {
	schema: ReturnType<SchemaVo["serialize"]>;
};

export class ValidationSchema extends BaseEntity implements IValidationSchema {
	#schema: SchemaVo;

	private constructor(
		readonly belongsTo: UUID,
		schema: SchemaVo,
	) {
		super();

		this.#schema = schema;
	}

	static new(schema: SchemaVo, user: User) {
		return new ValidationSchema(user.id, schema);
	}

	get schema() {
		return this.#schema;
	}

	updateSchema(newSchema: SchemaVo) {
		this.#schema = newSchema;

		this.markUpdated();
		return this;
	}

	forUpdate() {
		return {
			...super.forUpdate(),
			schema: this.#schema.serialize(),
		};
	}

	static fromSerialized(other: SerializedValidationSchema): ValidationSchema {
		const ent = new ValidationSchema(
			other.belongsTo,
			SchemaVo.fromSerialized(other.schema),
		);

		ent._fromSerialized(other);

		return ent;
	}

	serialize(): SerializedValidationSchema {
		return {
			...super._serialize(),
			belongsTo: this.belongsTo,
			schema: this.#schema.serialize(),
		};
	}
}
