export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Inter', -apple-system, sans-serif; line-height: 1.6; color: #2C1E1B; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FDFCFB;">
  <div style="background-color: #ffffff; padding: 48px; border-radius: 16px; border: 1px solid #F0EAE5; box-shadow: 0 10px 30px rgba(230, 126, 34, 0.05); border-top: 8px solid #E67E22;">
    <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 24px; color: #2C1E1B;">Verify your email</h2>
    <p style="font-size: 15px; color: #5D4037;">To complete your setup, please use the secure verification code below:</p>
    
    <div style="text-align: center; margin: 40px 0;">
      <div style="font-size: 38px; font-weight: 700; letter-spacing: 12px; color: #E67E22; background-color: #FFF5EB; padding: 24px; border-radius: 12px; border: 1px dashed #FAD7B5; display: inline-block;">
        {verificationCode}
      </div>
    </div>
    
    <p style="font-size: 14px; color: #8D6E63; line-height: 1.5;">This code will expire in <strong>15 minutes</strong>. If you did not request this, please ignore this email.</p>
    
    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #F0EAE5;">
      <p style="font-size: 14px; color: #A1887F; margin: 0;">Best regards,</p>
      <p style="font-size: 14px; font-weight: 600; color: #2C1E1B; margin: 4px 0;">The Support Team</p>
    </div>
  </div>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Inter', -apple-system, sans-serif; line-height: 1.6; color: #2C1E1B; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FDFCFB;">
  <div style="background-color: #ffffff; padding: 48px; border-radius: 16px; border: 1px solid #F0EAE5; box-shadow: 0 10px 30px rgba(230, 126, 34, 0.05); border-top: 8px solid #E67E22;">
    <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #2C1E1B;">Welcome on board, {name}!</h2>
    <p style="font-size: 16px; color: #5D4037;">Your account is officially verified. We're excited to help you get started with our services.</p>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="{dashboardURL}" style="background-color: #E67E22; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">Get Started Now</a>
    </div>
    
    <p style="font-size: 14px; color: #5D4037;">If you have any questions, feel free to reply to this email at any time.</p>
    
    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #F0EAE5;">
      <p style="font-size: 14px; color: #A1887F; margin: 0;">Happy to have you,</p>
      <p style="font-size: 14px; font-weight: 600; color: #2C1E1B; margin: 4px 0;">The Operations Team</p>
    </div>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Inter', -apple-system, sans-serif; line-height: 1.6; color: #2C1E1B; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FDFCFB;">
  <div style="background-color: #ffffff; padding: 48px; border-radius: 16px; border: 1px solid #F0EAE5; box-shadow: 0 10px 30px rgba(230, 126, 34, 0.05); border-top: 8px solid #E67E22;">
    <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 16px; color: #2C1E1B;">Password Reset</h2>
    <p style="font-size: 15px; color: #5D4037;">We received a request to reset your password. Click the button below to choose a new one:</p>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="{resetURL}" style="background-color: #E67E22; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">Reset Password</a>
    </div>
    
    <p style="font-size: 13px; color: #A1887F;">For security reasons, this link is only valid for 60 minutes. If you didn't request this, you can safely ignore this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Inter', -apple-system, sans-serif; line-height: 1.6; color: #2C1E1B; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FDFCFB;">
  <div style="background-color: #ffffff; padding: 48px; border-radius: 16px; border: 1px solid #F0EAE5; box-shadow: 0 10px 30px rgba(230, 126, 34, 0.05); border-top: 8px solid #2ECC71;">
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="background-color: #EEFBF3; color: #2ECC71; width: 64px; height: 64px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto; line-height: 64px;">✓</div>
    </div>
    <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 16px; color: #2C1E1B; text-align: center;">Password Updated</h2>
    <p style="font-size: 16px; color: #5D4037; text-align: center;">Your password has been successfully changed. You can now log in with your new credentials.</p>
    
    <div style="background-color: #FFF9C4; border-radius: 12px; padding: 16px; margin: 32px 0; border-left: 6px solid #F1C40F;">
      <p style="margin: 0; font-size: 14px; color: #7F8C8D;"><strong>Security Tip:</strong> If you did not make this change, please contact our support team immediately.</p>
    </div>
    
    <div style="text-align: center; margin-top: 32px;">
      <p style="font-size: 14px; font-weight: 600; color: #2C1E1B; margin: 0;">Security Team</p>
    </div>
  </div>
</body>
</html>
`;