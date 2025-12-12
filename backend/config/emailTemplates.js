
export const getWelcomeEmailTemplate = (name, email) => {
    const currentYear = new Date().getFullYear();
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to EventFlow</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(to bottom, #0a0a0a, #1a1a2e); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(to bottom, #0a0a0a, #1a1a2e); min-height: 100vh; padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; overflow: hidden; max-width: 100%; box-shadow: 0 0 40px rgba(255, 255, 255, 0.05);">
                    
                    <!-- Header Section -->
                    <tr>
                        <td align="center" style="padding: 50px 30px; background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1)); border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                            <h1 style="margin: 0 0 10px 0; font-size: 36px; font-weight: 800; color: #ffffff; text-align: center; line-height: 1.2;">Welcome to EventFlow</h1>
                            <p style="margin: 0; font-size: 16px; color: rgba(255, 255, 255, 0.6); text-align: center; line-height: 1.5;">Your journey to amazing events starts here</p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 24px; font-weight: 700; text-align: center;">Hello ${name}! 👋</h2>
                            <p style="margin: 0 0 30px 0; color: rgba(255, 255, 255, 0.7); font-size: 15px; line-height: 1.7; text-align: center;">Thank you for joining EventFlow. Your account has been successfully created and is ready to explore amazing events!</p>
                            
                            <!-- Account Details Card -->
                            <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 24px; margin: 30px 0;">
                                <h3 style="margin: 0 0 20px 0; color: #ffffff; font-size: 18px; font-weight: 600;">Account Details</h3>
                                
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                                            <p style="margin: 0; color: rgba(255, 255, 255, 0.5); font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Name</p>
                                            <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 15px; font-weight: 500;">${name}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                                            <p style="margin: 0; color: rgba(255, 255, 255, 0.5); font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                                            <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 15px; font-weight: 500;">${email}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <p style="margin: 0; color: rgba(255, 255, 255, 0.5); font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Status</p>
                                            <p style="margin: 5px 0 0 0;">
                                                <span style="display: inline-block; background: rgba(34, 197, 94, 0.1); color: #22c55e; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; border: 1px solid rgba(34, 197, 94, 0.3);">ACTIVE</span>
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- CTA Section -->
                            <div style="text-align: center; margin: 35px 0;">
                                <p style="margin: 0 0 20px 0; color: rgba(255, 255, 255, 0.7); font-size: 15px; line-height: 1.6;">Ready to discover amazing events?</p>
                                <a href="#" style="display: inline-block; background: #ffffff; color: #000000; padding: 14px 32px; border-radius: 50px; font-size: 14px; font-weight: 600; text-decoration: none; box-shadow: 0 0 20px rgba(255, 255, 255, 0.15);">Explore Events</a>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background: rgba(0, 0, 0, 0.3); padding: 30px 20px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: rgba(255, 255, 255, 0.5);">
                                Made with ❤️ by <strong style="color: rgba(147, 51, 234, 0.8);">omsaidesai</strong>
                            </p>
                            <p style="margin: 0 0 8px 0; font-size: 13px; color: rgba(255, 255, 255, 0.4);">
                                © ${currentYear} EventFlow. All rights reserved.
                            </p>
                            <p style="margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.3);">
                                This email was sent because you created an account with us.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

export const getVerificationEmailTemplate = (otp) => {
    const currentYear = new Date().getFullYear();
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your EventFlow Account</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(to bottom, #0a0a0a, #1a1a2e); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(to bottom, #0a0a0a, #1a1a2e); min-height: 100vh; padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; overflow: hidden; max-width: 100%; box-shadow: 0 0 40px rgba(255, 255, 255, 0.05);">
                    
                    <!-- Header Section -->
                    <tr>
                        <td align="center" style="padding: 50px 30px; background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1)); border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                            <h1 style="margin: 0 0 10px 0; font-size: 36px; font-weight: 800; color: #ffffff; text-align: center; line-height: 1.2;">Account Verification</h1>
                            <p style="margin: 0; font-size: 16px; color: rgba(255, 255, 255, 0.6); text-align: center; line-height: 1.5;">Secure your account with OTP verification</p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td align="center" style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 24px; font-weight: 700; text-align: center;">Verify Your Email</h2>
                            <p style="margin: 0 0 35px 0; color: rgba(255, 255, 255, 0.7); font-size: 15px; line-height: 1.7; text-align: center;">Enter the verification code below to complete your account setup</p>
                            
                            <!-- OTP Container -->
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 30px auto; background: rgba(147, 51, 234, 0.1); border: 1px solid rgba(147, 51, 234, 0.3); border-radius: 16px; padding: 30px 40px;">
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0 0 10px 0; font-size: 13px; color: rgba(255, 255, 255, 0.5); text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Your Verification Code</p>
                                        <h1 style="margin: 10px 0; font-size: 48px; font-weight: 800; letter-spacing: 12px; color: #ffffff; font-family: 'Courier New', monospace; background: rgba(255, 255, 255, 0.05); padding: 20px 30px; border-radius: 12px; border: 2px dashed rgba(255, 255, 255, 0.2);">${otp}</h1>
                                        <p style="margin: 10px 0 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.5); font-weight: 500;">⏰ Valid for 10 minutes</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Security Notice -->
                            <div style="background: rgba(251, 191, 36, 0.05); border: 1px solid rgba(251, 191, 36, 0.2); border-radius: 12px; padding: 20px; margin: 30px 0; text-align: left;">
                                <h4 style="margin: 0 0 10px 0; color: #fbbf24; font-size: 14px; font-weight: 600;">🔒 Security Notice</h4>
                                <p style="margin: 0; color: rgba(255, 255, 255, 0.6); font-size: 13px; line-height: 1.6;">
                                    Never share this code with anyone. Our team will never ask for your verification code.
                                </p>
                            </div>
                            
                            <p style="margin: 25px 0 0 0; color: rgba(255, 255, 255, 0.5); font-size: 13px; text-align: center;">
                                If you didn't request this, please ignore this email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background: rgba(0, 0, 0, 0.3); padding: 30px 20px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: rgba(255, 255, 255, 0.5);">
                                Made with ❤️ by <strong style="color: rgba(147, 51, 234, 0.8);">omsaidesai</strong>
                            </p>
                            <p style="margin: 0 0 8px 0; font-size: 13px; color: rgba(255, 255, 255, 0.4);">
                                © ${currentYear} EventFlow. All rights reserved.
                            </p>
                            <p style="margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.3);">
                                This is an automated security email.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}; 

export const getPasswordResetEmailTemplate = (otp) => {
    const currentYear = new Date().getFullYear();
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EventFlow Password Reset</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(to bottom, #0a0a0a, #1a1a2e); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(to bottom, #0a0a0a, #1a1a2e); min-height: 100vh; padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; overflow: hidden; max-width: 100%; box-shadow: 0 0 40px rgba(255, 255, 255, 0.05);">
                    
                    <!-- Header Section -->
                    <tr>
                        <td align="center" style="padding: 50px 30px; background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1)); border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                            <h1 style="margin: 0 0 10px 0; font-size: 36px; font-weight: 800; color: #ffffff; text-align: center; line-height: 1.2;">🔒 Password Reset</h1>
                            <p style="margin: 0; font-size: 16px; color: rgba(255, 255, 255, 0.6); text-align: center; line-height: 1.5;">Secure your account with a new password</p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td align="center" style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 24px; font-weight: 700; text-align: center;">Reset Your Password</h2>
                            <p style="margin: 0 0 35px 0; color: rgba(255, 255, 255, 0.7); font-size: 15px; line-height: 1.7; text-align: center;">We received a request to reset your password. Use the code below to create a new password.</p>
                            
                            <!-- OTP Container -->
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 30px auto; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 16px; padding: 30px 40px;">
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0 0 10px 0; font-size: 13px; color: rgba(255, 255, 255, 0.5); text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Password Reset Code</p>
                                        <h1 style="margin: 10px 0; font-size: 48px; font-weight: 800; letter-spacing: 12px; color: #ffffff; font-family: 'Courier New', monospace; background: rgba(255, 255, 255, 0.05); padding: 20px 30px; border-radius: 12px; border: 2px dashed rgba(255, 255, 255, 0.2);">${otp}</h1>
                                        <p style="margin: 10px 0 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.5); font-weight: 500;">⏰ Expires in 10 minutes</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Security Alert -->
                            <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; padding: 20px; margin: 30px 0; text-align: left;">
                                <h4 style="margin: 0 0 10px 0; color: #ef4444; font-size: 14px; font-weight: 600;">🚨 Security Alert</h4>
                                <p style="margin: 0 0 10px 0; color: rgba(255, 255, 255, 0.6); font-size: 13px; line-height: 1.6;">
                                    If you didn't request a password reset, please ignore this email.
                                </p>
                                <p style="margin: 0; color: rgba(255, 255, 255, 0.6); font-size: 13px; line-height: 1.6;">
                                    <strong>Never share this code!</strong> Our team will never ask for it.
                                </p>
                            </div>
                            
                            <p style="margin: 25px 0 0 0; color: rgba(255, 255, 255, 0.5); font-size: 13px; text-align: center;">
                                After entering the code, you'll create a new secure password.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background: rgba(0, 0, 0, 0.3); padding: 30px 20px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: rgba(255, 255, 255, 0.5);">
                                Made with ❤️ by <strong style="color: rgba(239, 68, 68, 0.8);">omsaidesai</strong>
                            </p>
                            <p style="margin: 0 0 8px 0; font-size: 13px; color: rgba(255, 255, 255, 0.4);">
                                © ${currentYear} EventFlow. All rights reserved.
                            </p>
                            <p style="margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.3);">
                                This is an automated security email.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

export const getTicketEmailTemplate = (name, eventName, eventDate, venue, ticketType, qrCodeUrl) => {
    const currentYear = new Date().getFullYear();

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your EventFlow Ticket</title>
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(to bottom, #0a0a0a, #1a1a2e); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(to bottom, #0a0a0a, #1a1a2e); min-height: 100vh; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; overflow: hidden; max-width: 100%; box-shadow: 0 0 40px rgba(255, 255, 255, 0.05);">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 50px 30px; background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1)); border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                            <h1 style="margin: 0 0 10px 0; font-size: 36px; font-weight: 800; color: #ffffff; text-align: center;">🎟️ Your Ticket is Ready!</h1>
                            <p style="margin: 0; font-size: 16px; color: rgba(255, 255, 255, 0.6); text-align: center;">Get ready for ${eventName}</p>
                        </td>
                    </tr>

                    <!-- Ticket Details -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #ffffff; font-size: 24px; font-weight: 700; text-align: center;">Hello ${name}! 👋</h2>
                            <p style="margin: 0 0 30px 0; color: rgba(255, 255, 255, 0.7); font-size: 15px; text-align: center;">Your ticket details for the upcoming event:</p>

                            <!-- Event Details Card -->
                            <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 24px; margin-bottom: 30px;">
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                                            <p style="margin: 0; color: rgba(255, 255, 255, 0.5); font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Event</p>
                                            <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 15px; font-weight: 600;">${eventName}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                                            <p style="margin: 0; color: rgba(255, 255, 255, 0.5); font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Date & Time</p>
                                            <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 15px; font-weight: 500;">${eventDate}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                                            <p style="margin: 0; color: rgba(255, 255, 255, 0.5); font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Venue</p>
                                            <p style="margin: 5px 0 0 0; color: #ffffff; font-size: 15px; font-weight: 500;">${venue}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <p style="margin: 0; color: rgba(255, 255, 255, 0.5); font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Ticket Type</p>
                                            <p style="margin: 5px 0 0 0;">
                                                <span style="display: inline-block; background: rgba(147, 51, 234, 0.1); color: #9333ea; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; border: 1px solid rgba(147, 51, 234, 0.3);">${ticketType}</span>
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <!-- QR Code -->
                            <div style="text-align: center; margin: 30px 0;">
                                <p style="margin: 0 0 15px 0; font-size: 14px; color: rgba(255, 255, 255, 0.6); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Scan at Entrance</p>
                                <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 20px; display: inline-block;">
                                    <img src="${qrCodeUrl}" alt="Ticket QR Code" style="width: 200px; height: 200px; border-radius: 12px; display: block;"/>
                                </div>
                            </div>

                            <p style="margin: 30px 0 0 0; font-size: 15px; color: rgba(255, 255, 255, 0.7); text-align: center;">We can't wait to see you there! 🎉</p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background: rgba(0, 0, 0, 0.3); padding: 30px 20px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: rgba(255, 255, 255, 0.5);">Made with ❤️ by <strong style="color: rgba(147, 51, 234, 0.8);">omsaidesai</strong></p>
                            <p style="margin: 0 0 8px 0; font-size: 13px; color: rgba(255, 255, 255, 0.4);">© ${currentYear} EventFlow. All rights reserved.</p>
                            <p style="margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.3);">Present this QR code at the entrance.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};
