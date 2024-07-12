import { BaseEntity, Email, type IEntity } from "@carbonteq/hexapp";
import { SimpleSerialized } from "@shared/types";

export interface IUser extends IEntity {
	username: string;
	email: Email;
	pwHashed: string;
}

export type SerializedUser = SimpleSerialized<IUser>;

export class User extends BaseEntity implements IUser {
	#email: IUser["email"];
	#pwHashed: IUser["pwHashed"];

	private constructor(
		readonly username: string,
		email: Email,
		pwHashed: string,
	) {
		super();

		this.#email = email;
		this.#pwHashed = pwHashed;
	}

	get email() {
		return this.#email;
	}

	get pwHashed() {
		return this.#pwHashed;
	}

	static fromSerialized(other: SerializedUser): User {
		const ent = new User(other.username, other.email, other.pwHashed);

		ent._fromSerialized(other);

		return ent;
	}

	serialize(): SerializedUser {
		return {
			...super._serialize(),
			username: this.username,
			email: this.#email,
			pwHashed: this.#pwHashed,
		};
	}
}
