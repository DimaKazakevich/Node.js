const nodemailer = require("nodemailer");

function send(message) {
    const sendTo = 'kazak1629@gmail.com';
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      service: 'gmail',
      secure: false,
      auth: {
        user: 'uniteddirectonlinestore@gmail.com',
        pass: 'UDS2077563', 
      },
    });
  
    let info = transporter.sendMail({
      from: 'uniteddirectonlinestore@gmail.com',
      to: sendTo,
      text: message, 
      html: `<b>${message}</b>`, 
    });
  }

  exports.send = send;