const nodemailer = require('nodemailer');

const sendEmail = async options => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const message = {
    from:process.env.FROM_EMAIL,
    to: options.email, //list of receivers
    subject: options.subject, //subject line
    text: options.message //plain text body
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;




//piece of code to chekc later 
// `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,