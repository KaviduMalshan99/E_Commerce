// emailService.js
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const sendEmailO = async (emailDetails) => {
  const { customerEmail, subject, htmlContent, attachments } = emailDetails;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nirmalsubashana3@gmail.com',
        pass: 'xibv nzlv izdg unem'
      }
    });

    const mailOptions = {
      from: '"WellWorn Private Limited" <nirmalsubashana3@gmail.com>',
      to: customerEmail,
      subject,
      html: htmlContent,
      attachments
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendEmailO };


