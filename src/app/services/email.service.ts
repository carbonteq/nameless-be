import { Email, UUID } from "@carbonteq/hexapp";
import { templates } from "@infra/email/email-templates";

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
			templateId: "verification",
			templateVars: {
				verificationLink: `${baseUrl}/${ticketId}`,
			},
		});
	}

	async sendForgotPasswordEmail(email: Email, baseUrl: string, reqId: UUID) {
		return await this.send({
			to: email,
			subject: "Reset your password",
			templateId: "forgetPassword",
			templateVars: {
				resetLink: `${baseUrl}/${reqId}`,
			},
		});
	}
}
