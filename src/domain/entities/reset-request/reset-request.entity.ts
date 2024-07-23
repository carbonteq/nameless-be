import { Result } from "@carbonteq/fp";
import {
	BaseEntity,
	DateTime,
	type IEntity,
	Omitt,
	UUID,
} from "@carbonteq/hexapp";
import { SimpleSerialized } from "@shared/types";
import { User } from "../user/user.entity";
import { InvalidResetReq } from "./reset-request.errors";

export interface IResetRequest extends IEntity {
	userId: UUID;
	expiryDate: DateTime;
	active: boolean;
}

export type SerializedResetRequest = SimpleSerialized<IResetRequest>;
type ResetReqUpdateData = Pick<IResetRequest, "active" | "updatedAt">;

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

	guardAgainstInvalidUpdate(): Result<this, InvalidResetReq> {
		if (this.#active) return Result.Ok(this);

		return Result.Err(new InvalidResetReq(this.id));
	}

	setInvactive() {
		return this.guardAgainstInvalidUpdate().map((req) => {
			req.#active = false;
			req.markUpdated();

			return req;
		});
	}

	guardAgainstExpiry(): Result<this, InvalidResetReq> {
		const now = new Date();
		if (this.expiryDate >= now) return Result.Ok(this);

		return Result.Err(new InvalidResetReq(this.id));
	}

	static forUser(user: User) {
		return new ResetRequest(user.id, DateTime.from(genExp()), true);
	}

	get active() {
		return this.#active;
	}

	forUpdate(): ResetReqUpdateData {
		return {
			...super.forUpdate(),
			active: this.#active,
		};
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
