import { BaseEntity, Email, type IEntity, Omitt } from "@carbonteq/hexapp";
import { Username } from "@domain/refined/user.refined";
import { SimpleSerialized } from "@shared/types";

export interface IUser extends IEntity {
	username: Username;
	email: Email;
	pwHashed: string;
	// TODO: add isVerified
}

export type SerializedUser = SimpleSerialized<IUser>;
type UserUpdateData = Omitt<IUser, "id" | "createdAt" | "username">;

export class User extends BaseEntity implements IUser {
	#email: IUser["email"];
	#pwHashed: IUser["pwHashed"];

	private constructor(
		readonly username: Username,
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

	static new(username: Username, email: Email, pwHashed: string) {
		return new User(username, email, pwHashed);
	}

	passwordUpdate(pwHashed: string) {
		this.#pwHashed = pwHashed;
		this.markUpdated();
		return this;
	}

	forUpdate(): UserUpdateData {
		return {
			...super.forUpdate(),
			email: this.#email,
			pwHashed: this.#pwHashed,
		};
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
