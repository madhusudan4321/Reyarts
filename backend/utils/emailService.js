const nodemailer = require('nodemailer');

const sendEmail = async ({ name, email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `[Reyarts Contact] ${subject}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #1a1a1a; color: #f5f0e8; border-radius: 8px;">
        <h2 style="color: #c9a84c; margin-bottom: 20px;">New Message from Reyarts</h2>
        <p><strong style="color: #c9a84c;">From:</strong> ${name} (${email})</p>
        <p><strong style="color: #c9a84c;">Subject:</strong> ${subject}</p>
        <hr style="border-color: #333; margin: 20px 0;" />
        <p style="line-height: 1.8;">${message}</p>
        <hr style="border-color: #333; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">This message was sent via the Reyarts contact form.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
