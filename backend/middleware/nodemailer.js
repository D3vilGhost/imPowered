import nodemailer from "nodemailer";

async function sendMailForOTP(email, otp) {
    //setting up the transporter and connecting with gmail server
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_PASSWORD
            },
        });

        const info = await transporter.sendMail({
            from: '"imPowered" <hey@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "imPowered Registration", // Subject line
            text: `Your One-Time Password (OTP) for completing your registration is: ${otp}. Please note, this OTP is valid for only 2 minutes.`,
        });

        return { message: "Mail Sent Successfully!" };

    } catch (error) {
        return { error: error.message };
    }


}
export default sendMailForOTP;