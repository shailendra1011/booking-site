import nodemailer from 'nodemailer';

export async function sendBill(data) {
    try {
       

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // use TLS
            auth: {
                user: "raymartin942@gmail.com",
                pass: "bslrkkthbskxxjyn"
            }
        });

        const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Booking Notification</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f6fa; margin: 0; padding: 0; }
          .email-container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 10px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 20px 30px; }
          h2 { color: #222; text-align: center; margin-bottom: 5px; }
          p { text-align: center; color: #555; margin: 0 0 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          td { padding: 10px 5px; border-bottom: 1px solid #e9e9e9; color: #333; }
          td:first-child { font-weight: bold; width: 40%; }
          .total { font-size: 18px; font-weight: bold; color: #000; text-align: right; padding-top: 10px; }
          .amount { color: #000; font-size: 18px; font-weight: bold; text-align: left; padding-top: 10px; }
          .footer { text-align: center; margin-top: 25px; font-size: 13px; color: #888; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <h2>New Booking Received</h2>
          <p>A new booking has been placed on <strong> ITH</strong>.<br>
          Please review the details below and contact the customer to confirm.</p>
          <table>
            <tr><td>Booking ID</td><td>${data.bookingId}</td></tr>
            <tr><td>Booking Type</td><td>${data.booking_type}</td></tr>
            <tr><td>Pickup Address</td><td>${data.pickup_address}</td></tr>
            <tr><td>Drop Address</td><td>${data.drop_address}</td></tr>
            <tr><td>Car</td><td>${data.vehicle_name}</td></tr>
            <tr><td>Customer Email</td><td>${data.email}</td></tr>
            <tr><td>Customer Contact</td><td>${data.mobile}</td></tr>
          </table>
          <table style="margin-top: 10px;">
            <tr><td class="total">Total Fare</td><td class="amount">₹${data.total_price}</td></tr>
          </table>
          <div class="footer">
            This is an automated booking notification from ITH.<br>
            © 2025 ITH. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

        const mailOptions = {
            from: '"Hassle-Free Car ITH System" <raymartin942@gmail.com>',
            to: "jatin@yopmail.com", // admin email
            // to: "PratimSarkar@ith.co.in", // admin email
            subject: "New Booking Received – Hassle-Free Car ITH",
            text: `Hello Team,

A new booking has been received on Hassle-Free Car ITH. Here are the details:

Booking ID: 7R1UYQT8Q0
Booking Type: Within City
Pickup Location: Rohini, Delhi, India
Drop Location: J6GF+X45, KG Marg, Atul Grove Road, Janpath, Barakhamba, New Delhi, Delhi 110001, India
Car: Aura
Customer Email: shailendrashukla1011@gmail.com
Customer Contact: 9354685716
Total Fare: ₹230.00

Please contact the customer to confirm the booking and make necessary arrangements.

Regards,
Hassle-Free Car ITH Booking System`,
            html: htmlTemplate
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.response);

    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
}
