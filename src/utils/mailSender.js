import nodemailer from 'nodemailer'

export const mailSender = async (email, title, body) => {
    //console.log("mail",email,title,body)
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.HOST_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    let info = await transporter.sendMail({
      from: "The Drag",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    console.log("info", info);
    return info;
  } catch (error) {
    console.log("error", error.message);
  }
};


