const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, //true for port 465, false for other ports
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// const mailOption = {
//   from: `Aprameya R <${process.env.GMAIL_ID || "fallback@example.com"}>`,
//   to: ["1rn21cs030.aprameya@gmail.com"],
//   subject: `Powered by ${process.env.COMPANY_NAME}`,
//   text: "Hello, this is a trial email.",
// };

module.exports = { transporter };
