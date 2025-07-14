import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
await transporter.verify().catch((error) => {
  console.error("Failed to connect to email service", {
    error: error.message,
    stack: error.stack,
  });
});

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
