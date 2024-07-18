import { BaseEntity, type IEntity, Omitt } from "@carbonteq/hexapp";
import { SimpleSerialized } from "@shared/types";

export interface IResetRequest extends IEntity {
	userId: string;
	token: string;
	expiryDate: Date;
}

export type SerializedResetRequest = SimpleSerialized<IResetRequest>;

export class ResetRequest extends BaseEntity implements IResetRequest {
	#userId: IResetRequest["userId"];
	#token: IResetRequest["token"];
	expiryDate: IResetRequest["expiryDate"];

	private constructor(userId: string, token: string, expiryDate: Date) {
		super();

		this.#userId = userId;
		this.#token = token;
		this.expiryDate = expiryDate;
	}

	get userId() {
		return this.#userId;
	}

	get token() {
		return this.token;
	}

	static new(userId: string, token: string, expiry_date: Date) {
		return new ResetRequest(userId, token, expiry_date);
	}

	//Idk what this does, but since it was in user entity, it is here as well.
	static fromSerialized(other: SerializedResetRequest): ResetRequest {
		const ent = new ResetRequest(other.userId, other.token, other.expiryDate);

		ent._fromSerialized(other);

		return ent;
	}

	serialize(): SerializedResetRequest {
		return {
			...super._serialize(),
			userId: this.#userId,
			token: this.#token,
			expiryDate: this.expiryDate,
		};
	}
}
