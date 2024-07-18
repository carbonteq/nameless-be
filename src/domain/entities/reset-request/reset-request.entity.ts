import { BaseEntity, DateTime, type IEntity, UUID } from "@carbonteq/hexapp";
import { SimpleSerialized } from "@shared/types";
import { User } from "../user/user.entity";

export interface IResetRequest extends IEntity {
	userId: UUID;
	expiryDate: DateTime;
	active: boolean;
}

export type SerializedResetRequest = SimpleSerialized<IResetRequest>;

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const genExp = () => new Date(Date.now() + ONE_WEEK_MS);

export class ResetRequest extends BaseEntity implements IResetRequest {
	#active: boolean;

	private constructor(
		readonly userId: UUID,
		readonly expiryDate: DateTime,
		active: boolean,
	) {
		super();

		this.#active = active;
	}

	static forUser(user: User) {
		return new ResetRequest(user.id, DateTime.from(genExp()), true);
	}

	get active() {
		return this.#active;
	}

	static fromSerialized(other: SerializedResetRequest): ResetRequest {
		const ent = new ResetRequest(other.userId, other.expiryDate, other.active);

		ent._fromSerialized(other);

		return ent;
	}

	serialize(): SerializedResetRequest {
		return {
			...super._serialize(),
			userId: this.userId,
			expiryDate: this.expiryDate,
			active: this.#active,
		};
	}
}
