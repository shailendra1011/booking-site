import nodemailer from 'nodemailer';

export function sendOtp(email, otp) {
    // __define-ocg__ Nodemailer transporter setup
    const varOcg = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "raymartin942@gmail.com",
            pass: "bslrkkthbskxxjyn"
        }
    });

    const mailOptions = {
        from: 'Booking Site <noreply@brandwagon.com>',
        to: email,
        subject: 'Your OTP Code for Email Verification',
        text: `Your verification OTP is ${otp}. Please enter this code to verify your email.`,
        html: `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Email Verification</title>
            </head>
            <body style="margin:0; padding:0; background-color:#f9fafb; font-family:Arial, sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; padding:20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:6px; padding:35px;">
                                <tr>
                                    <td style="color:#3d4852; font-size:20px; font-weight:bold; text-align:left;">
                                        Email Verification
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color:#3d4852; font-size:16px; line-height:1.6em; text-align:left; padding-top:15px;">
                                        Hello,<br/><br/>
                                        Thank you for registering with <strong>Booking Site</strong>! To complete your email verification, please use the following One-Time Password (OTP):
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding:25px 0;">
                                        <div style="display:inline-block; background-color:#3490dc; color:#ffffff; font-size:22px; font-weight:bold; letter-spacing:3px; padding:15px 30px; border-radius:8px;">
                                            ${otp}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color:#3d4852; font-size:15px; line-height:1.6em; text-align:left;">
                                        This OTP is valid for <strong>10 minutes</strong>. Please do not share this code with anyone for your account security.
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color:#3d4852; font-size:16px; line-height:1.6em; text-align:left; padding-top:25px;">
                                        Regards,<br/>
                                        <strong>Booking Site Team</strong>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
        `
    };

    varOcg.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending OTP email:", error);
        } else {
            console.log("✅ OTP email sent:", info.response);
        }
    });
}
