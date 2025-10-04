import nodemailer from 'nodemailer';

export function sendMail(url) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "raymartin942@gmail.com",
            pass: "bslrkkthbskxxjyn"
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

