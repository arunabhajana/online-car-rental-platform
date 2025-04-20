const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const VERIFIED_SENDER = process.env.VERIFIED_SENDER;

sgMail.setApiKey(SENDGRID_API_KEY);

app.use(cors());
app.use(express.json());

app.post('/send-booking-email', async (req, res) => {
  const { userEmail, carName, date, duration, total } = req.body;

  const msg = {
    to: userEmail,
    from: VERIFIED_SENDER,
    subject: '🚗 Booking Confirmed!',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f7fc; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <h2 style="text-align: center; color: #28a745;">Your Booking is Confirmed!</h2>
          <p style="font-size: 16px; color: #555555; text-align: center;">Thank you for booking with us. Below are the details of your booking:</p>
  
          <div style="background-color: #f7f7f7; padding: 20px; margin-top: 20px; border-radius: 5px;">
            <h3 style="color: #333333;">Booking Details</h3>
            <p><strong>Car:</strong> ${carName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Duration:</strong> ${duration} day(s)</p>
            <p><strong>Total Paid:</strong> ₹${total}</p>
          </div>
  
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 16px; color: #555555;">We look forward to seeing you soon!</p>
            <p><a href="https://online-car-rental-platform.vercel.app" style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; font-weight: bold; border-radius: 4px; text-transform: uppercase;">Visit Your Booking</a></p>
          </div>
  
          <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #888888;">
            <p>For any questions or support, feel free to <a href="mailto:arunabhajana@gmail.com" style="color: #28a745; text-decoration: none;">contact us</a>.</p>
            <p>&copy; ${new Date().getFullYear()} Bookcars. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
  };
  

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    console.error('SendGrid Error:', error.response?.body || error.message);
    res.status(500).json({ error: 'Email send failed' });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
