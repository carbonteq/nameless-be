export const templates = {
	forgetPassword: (templateVars: Record<string, unknown>) => `
      <html>
        <body>
          <p>Reset your password by clicking the link below:</p>
          <a href="${templateVars.resetLink}">Reset Password</a>
        </body>
      </html>
    `,
	verification: (templateVars: Record<string, unknown>) => `
      <html>
        <body>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${templateVars.verificationLink}">Verify Email</a>
        </body>
      </html>
    `,
	default: () => `
    <html>
        <body>
          <p>Default Email Template</p>
        </body>
      </html>`,
	// Add more templates here
};
