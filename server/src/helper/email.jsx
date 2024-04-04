const nodemailer = require("nodemailer");
const { smtpUsername, smtpPassword } = require("../secret.jsx");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: smtpUsername,
    pass: smtpPassword,
  },
});

// mail Options
const emailWithNodeMailer = async (emailData) => {
  try {
    const mailOptions = {
      from: {
        name: "MRMGroup",
        address: smtpUsername,
      },
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.response);
  } catch (error) {
    console.error("Error Occurred while sending Email", error);
    throw error;
  }
};

module.exports = emailWithNodeMailer;
