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
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Confirmation</title>
  </head>

  <body
    style="
      font-family: Arial, Helvetica, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f7f7f7;
    "
  >
    <table
      cellpadding="0"
      cellspacing="0"
      border="0"
      width="100%"
      style="background-color: #f7f7f7; padding: 40px 0"
    >
      <tr>
        <td align="center">
          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="600"
            style="
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              padding: 30px;
              text-align: center;
            "
          >
            <tr>
              <td>
                <img
                  src="https://www.freeiconspng.com/thumbs/success-icon/success-icon-10.png"
                  alt="Confirm"
                  width="80"
                  style="margin-bottom: 20px"
                />
                <h5
                  style="
                    font-size: 22px;
                    font-weight: 700;
                    color: #222;
                    margin: 0 0 40px;
                  "
                >
                  Booking Received
                </h5>
              </td>
            </tr>
            <tr>
              <td>
                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="border-collapse: collapse; margin-bottom: 20px"
                >
                  <tr>
                    <td
                      style="padding: 10px 0; border-bottom: 1px solid #e8e8e8"
                    >
                      <strong style="float: left">Booking ID</strong>
                      <span style="float: right">${data.bookingId}</span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="padding: 10px 0; border-bottom: 1px solid #e8e8e8"
                    >
                      <strong style="float: left">Booking Type</strong>
                      <span style="float: right">${data.booking_type}</span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="padding: 10px 0; border-bottom: 1px solid #e8e8e8"
                    >
                      <strong style="float: left">Pickup Location</strong>
                      <span style="float: right">${data.pickup_address}</span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="padding: 10px 0; border-bottom: 1px solid #e8e8e8"
                    >
                      <strong style="float: left">Drop Location</strong>
                      <span style="float: right">${data.drop_address}</span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="padding: 10px 0; border-bottom: 1px solid #e8e8e8"
                    >
                      <strong style="float: left">Car</strong>
                      <span style="float: right">${data.vehicle_name}</span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="padding: 10px 0; border-bottom: 1px solid #e8e8e8"
                    >
                      <strong style="float: left">Email Address</strong>
                      <span style="float: right">${data.email}</span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="padding: 10px 0; border-bottom: 1px solid #e8e8e8"
                    >
                      <strong style="float: left">Contact Number</strong>
                      <span style="float: right">${data.mobile}</span>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="padding: 15px 0; font-size: 18px; font-weight: 600"
                    >
                      <strong style="float: left">Total Fare</strong>
                      <span style="float: right; color: #000"
                        >₹${data.total_price}</span
                      >
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `;

        const mailOptions = {
            from: '"Hassle-Free Car ITH System" <raymartin942@gmail.com>',
            // to: "shailendrashukla1011@gmail.com", // admin email
            to: "jatin@yopmail.com", // admin email
            // to: "PratimSarkar@ith.co.in", // admin email
            subject: "New Booking Received – Hassle-Free Car ITH",
//             text: `Hello Team,

// A new booking has been received on Hassle-Free Car ITH. Here are the details:

// Booking ID: 7R1UYQT8Q0
// Booking Type: Within City
// Pickup Location: Rohini, Delhi, India
// Drop Location: J6GF+X45, KG Marg, Atul Grove Road, Janpath, Barakhamba, New Delhi, Delhi 110001, India
// Car: Aura
// Customer Email: shailendrashukla1011@gmail.com
// Customer Contact: 9354685716
// Total Fare: ₹230.00

// Please contact the customer to confirm the booking and make necessary arrangements.

// Regards,
// Hassle-Free Car ITH Booking System`,
            html: htmlTemplate
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.response);

    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
}
