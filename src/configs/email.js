import nodemailer from 'nodemailer'

export const sendEmail = async (email, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      name: process.env.NAME,
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    })

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: htmlContent
    })
  } catch (error) {
    throw new Error(error)
  }
}
