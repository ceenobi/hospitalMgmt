import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587, // Recommended port with STARTTLS
  secure: false, // true for 465, false for other ports
  requireTLS: true, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: process.env.NODE_ENV === 'production'
  }
});
const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ Email service connection verified");
  } catch (error) {
    console.error("❌ Failed to connect to email service", {
      error: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
    // Consider throwing the error if email is critical for your app
    throw new Error("Email service connection failed");
  }
};
verifyEmailConnection().catch(console.error);

export const sendMail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: "Clinicare <charlesmutob@gmail.com>",
    to,
    subject,
    html,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
