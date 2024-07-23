import { Result } from "@carbonteq/fp";
import { BaseEntity, DateTime, type IEntity, UUID } from "@carbonteq/hexapp";
import { SimpleSerialized } from "@shared/types";
import { User } from "../user/user.entity";
import { InvalidVerifyReq } from "./verify-request.errors";

export interface IVerifyRequest extends IEntity {
	userId: UUID;
	expiryDate: DateTime;
	active: boolean;
}

export type SerializedVerifyRequest = SimpleSerialized<IVerifyRequest>;
type VerifyReqUpdateData = Pick<IVerifyRequest, "active" | "updatedAt">;

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const genExp = () => new Date(Date.now() + ONE_WEEK_MS);

export class VerifyRequest extends BaseEntity implements IVerifyRequest {
	#active: boolean;

	private constructor(
		readonly userId: UUID,
		readonly expiryDate: DateTime,
		active: boolean,
	) {
		super();

		this.#active = active;
	}
	guardAgainstInvalidUpdate(): Result<this, InvalidVerifyReq> {
		if (this.#active) return Result.Ok(this);

		return Result.Err(new InvalidVerifyReq(this.id));
	}

	setInvactive() {
		return this.guardAgainstInvalidUpdate().map((req) => {
			req.#active = false;
			req.markUpdated();

			return req;
		});
	}

	guardAgainstExpiry(): Result<this, InvalidVerifyReq> {
		const now = new Date();
		if (this.expiryDate >= now) return Result.Ok(this);

		return Result.Err(new InvalidVerifyReq(this.id));
	}

	static forUser(user: User) {
		return new VerifyRequest(user.id, DateTime.from(genExp()), true);
	}

	get active() {
		return this.#active;
	}

	forUpdate(): VerifyReqUpdateData {
		return {
			...super.forUpdate(),
			active: this.#active,
		};
	}

	static fromSerialized(other: SerializedVerifyRequest): VerifyRequest {
		const ent = new VerifyRequest(other.userId, other.expiryDate, other.active);

		ent._fromSerialized(other);

		return ent;
	}

	serialize(): SerializedVerifyRequest {
		return {
			...super._serialize(),
			userId: this.userId,
			expiryDate: this.expiryDate,
			active: this.#active,
		};
	}
}
