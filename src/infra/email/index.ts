import { EmailPayload, EmailService } from "@app/services/email.service";
import { Injectable, Provider } from "@nestjs/common";

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

export const EmailServProvider: Provider<EmailService> = {
	provide: EmailService,
	useClass: ConsoleEmailService,
};
