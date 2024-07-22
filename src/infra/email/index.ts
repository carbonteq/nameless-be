import { EmailPayload, EmailService } from "@app/services/email.service";
import { Injectable, Provider } from "@nestjs/common";
import { Resend } from "resend";
import { templates } from "./email-templates";

@Injectable()
class ConsoleEmailService extends EmailService {
	async send<T extends Record<string, unknown>>(
		payload: EmailPayload<T>,
	): Promise<void> {
		console.debug(
			"Sending email to",
			payload.to,
			"with subject",
			payload.subject,
			"and template vars",
			payload.templateVars,
		);
	}
}

@Injectable()
class ResendEmailService extends EmailService {
	private readonly resend = new Resend(process.env.EMAIL_API_KEY);

	async send<T extends Record<string, unknown>>(
		payload: EmailPayload<T>,
	): Promise<void> {
		let { to, subject, templateId, templateVars } = payload;

		if (templateId === undefined) templateId = "default";

		const emailPayload = {
			from: "Nameless <onboarding@resend.dev>",
			to: to,
			subject: subject,
			html: templates[templateId](templateVars || {}),
		};

		const { data, error } = await this.resend.emails.send(emailPayload);
		console.debug("Email sent successfully:", data);
		console.debug("Error:", error);
	}
}

export const EmailServProvider: Provider<EmailService> = {
	provide: EmailService,
	useClass: ResendEmailService,
};
