import { BaseEntity, Email, type IEntity, Omitt } from "@carbonteq/hexapp";
import { Username } from "@domain/refined/user.refined";
import { SimpleSerialized } from "@shared/types";

export interface IUser extends IEntity {
	username: Username;
	email: Email;
	pwHashed: string;
	isVerified: boolean; //false by default
}

export type SerializedUser = SimpleSerialized<IUser>;
type UserUpdateData = Omitt<IUser, "id" | "createdAt" | "username">;

export class User extends BaseEntity implements IUser {
	#email: IUser["email"];
	#pwHashed: IUser["pwHashed"];
	isVerified: boolean;

	private constructor(
		readonly username: Username,
		email: Email,
		pwHashed: string,
		isVerified: boolean,
	) {
		super();

		this.#email = email;
		this.#pwHashed = pwHashed;
		this.isVerified = isVerified;
	}

	get email() {
		return this.#email;
	}

	get pwHashed() {
		return this.#pwHashed;
	}

	get userName() {
		return this.username;
	}

	setIsVerified() {
		this.isVerified = true;
		return this;
	}
	static new(
		username: Username,
		email: Email,
		pwHashed: string,
		isVerified = false,
	) {
		return new User(username, email, pwHashed, isVerified);
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
			isVerified: this.isVerified,
		};
	}

	static fromSerialized(other: SerializedUser): User {
		const ent = new User(
			other.username,
			other.email,
			other.pwHashed,
			other.isVerified,
		);

		ent._fromSerialized(other);

		return ent;
	}

	serialize(): SerializedUser {
		return {
			...super._serialize(),
			username: this.username,
			email: this.#email,
			pwHashed: this.#pwHashed,
			isVerified: this.isVerified,
		};
	}
}
