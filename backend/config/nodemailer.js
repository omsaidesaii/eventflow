import nodemailer from 'nodemailer';

// Source - https://stackoverflow.com/a
// Posted by Gour Chandra Saha
// Retrieved 2025-12-13, License - CC BY-SA 4.0
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default transporter;
