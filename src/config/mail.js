require('dotenv').config();
export default {
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: "bruno.santi.98@outlook.com",
      pass: process.env.MAIL_PASS,
    },
  };