import { Email, UUID } from "@carbonteq/hexapp";

export interface EmailPayload<T extends Record<string, unknown>> {
	to: Email;
	subject: string;
	templateId?: string;
	templateVars?: T;
}

export abstract class EmailService {
	abstract send<T extends Record<string, unknown>>(
		payload: EmailPayload<T>,
	): Promise<void>;

	async sendVerificationLink(email: Email, baseUrl: string, ticketId: UUID) {
		return await this.send({
			to: email,
			subject: "Verify your email",
			templateVars: {
				verificationLink: `${baseUrl}/${ticketId}`,
			},
		});
	}
}
