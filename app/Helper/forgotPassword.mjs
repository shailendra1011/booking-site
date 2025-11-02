import nodemailer from 'nodemailer';

export function sendMail(url, email) {
    const decodedEmail = Buffer.from(email, 'base64').toString();
    console.log(decodedEmail);

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "raymartin942@gmail.com",
            pass: "bslrkkthbskxxjyn"
        }
    });
    const mailOptions = {
        from: 'Booking Site <noreply@brandwagon.com>',
        to: decodedEmail,
        subject: 'Reset Password',
        text: 'You requested a password reset. Visit the link to reset your password:'`${url}`,
        html: `
        <!DOCTYPE html>
        <html>
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            </head>
            <body style="margin:0; padding:0; background-color:#f9fafb; font-family:Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; padding:20px;">
                <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:6px; padding:35px;">
                    <tr>
                        <td style="color:#3d4852; font-size:19px; font-weight:bold; text-align:left;">
                        Hello!
                        </td>
                    </tr>
                    <tr>
                        <td style="color:#3d4852; font-size:16px; line-height:1.5em; text-align:left; padding-top:10px;">
                        You are receiving this email because we received a password reset request for your account.
                        </td>
                    </tr>
                    
                    <!-- Action Button -->
                    <tr>
                        <td align="center" style="padding:30px 0;">
                        <a href="${url}" 
                            target="_blank"
                            style="background-color:#3490dc; color:#ffffff; font-size:16px; font-weight:bold; padding:12px 24px; border-radius:4px; text-decoration:none; display:inline-block;">
                            Reset Password
                        </a>
                        </td>
                    </tr>
                    
                    <!-- Security Notice -->
                    <tr>
                        <td style="color:#3d4852; font-size:18px; font-weight:bold; text-align:left; padding-top:20px;">
                        Security Notice
                        </td>
                    </tr>
                    <tr>
                        <td style="color:#3d4852; font-size:15px; line-height:1.6em; text-align:left; padding-top:10px;">
                        For your security, please ensure that you never share your password with anyone. 
                        Our team will never ask you for login credentials over email or phone.
                        </td>
                    </tr>
                    
                  
                    <tr>
                        <td style="color:#3d4852; font-size:16px; line-height:1.5em; text-align:left; padding-top:25px;">
                        Regards,<br/>
                        <strong>ITH Team</strong>
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


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

