import nodemailer from 'nodemailer';

export function sendMail(url) {
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "383cd5e52a69b8",
            pass: "336e6b7f9f9c56"
        }
    });
    const mailOptions = {
        from: 'youremail@mail.com',
        to: 'recieveremail@mail.com',
        subject: 'Your email title here',
        text: 'your email body content here',
        html: `
         <h1>OTP for Reset Password:</h1>
         <p>${url}</p>
        `,
        // attachments: [
        //     {
        //         filename: 'image.png',
        //         path: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
        //     }
        // ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

