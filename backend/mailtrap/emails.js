import {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email Account",
            html: VERIFICATION_EMAIL_TEMPLATE.replace(/{verificationCode}/g, verificationToken),
            category: "Authentication",
        });
        console.log(`[AUTH] Verification email sent successfully to: ${email}`);
    } catch (error) {
        console.error(`[ERROR] sendVerificationEmail:`, error.message);
        throw new Error(`Failed to send verification email to ${email}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Welcome to BookHaven", 
            html: WELCOME_EMAIL_TEMPLATE
                .replace(/{name}/g, name)
                .replace(/{dashboardURL}/g, process.env.CLIENT_URL), 
            category: "Onboarding",
        });
        console.log(`[ONBOARDING] Welcome email sent successfully to: ${email}`);
    } catch (error) {
        console.error(`[ERROR] sendWelcomeEmail:`, error.message);
        throw new Error(`Failed to send welcome email to ${email}`);
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{ email }];

    try {
        await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(/{resetURL}/g, resetURL),
            category: "Password Reset",
        });
        console.log(`[SECURITY] Password reset link sent to: ${email}`);
    } catch (error) {
        console.error(`[ERROR] sendPasswordResetEmail:`, error.message);
		
        throw new Error(`Failed to send password reset email to ${email}`);
    }
};

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];

    try {
        await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Security Alert: Password Changed",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Security",
        });
        console.log(`[SECURITY] Password reset success confirmation sent to: ${email}`);
    } catch (error) {
        console.error(`[ERROR] sendResetSuccessEmail:`, error.message);
        throw new Error(`Failed to send reset success email to ${email}`);
    }
};