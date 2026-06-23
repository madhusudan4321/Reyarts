const sendEmail = require('../utils/emailService');

const sendContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    await sendEmail({ name, email, subject, message });
    res.json({ message: 'Message sent successfully! Reya will get back to you soon.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
};

module.exports = { sendContact };
