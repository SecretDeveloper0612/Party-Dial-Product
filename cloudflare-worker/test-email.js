import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: 'noreply@partydial.com',
        pass: 'PreetTech08@123',
    }
});
transporter.sendMail({
    from: 'noreply@partydial.com',
    to: 'test@partydial.com',
    subject: 'Test',
    text: 'Test'
}).then(() => console.log('Success')).catch(e => console.error(e));
