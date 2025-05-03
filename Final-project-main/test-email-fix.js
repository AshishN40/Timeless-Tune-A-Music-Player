import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('Using email credentials:');
console.log('User:', process.env.EMAIL_USER);
console.log('Password:', process.env.EMAIL_PASSWORD ? 'Password is set (not showing for security)' : 'Password is NOT set');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  debug: true, // Enable debug output
  logger: true, // Log information to the console
  tls: {
    rejectUnauthorized: false
  }
});

async function testEmail() {
  try {
    const verifyResult = await transporter.verify();
    console.log('SMTP connection successful!', verifyResult);
    
    // Try sending a test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'Test Email',
      text: 'If you receive this, the email configuration is working!'
    });
    
    console.log('Test email sent:', info.messageId);
  } catch (error) {
    console.error('SMTP error details:', error);
    if (error.code === 'EAUTH') {
      console.error('\nAuthentication failed. Possible issues:');
      console.error('1. Email password might be incorrect');
      console.error('2. Need to use an App Password if 2FA is enabled on your Google account');
      console.error('3. "Less secure app access" might need to be enabled (though not recommended)');
    }
  }
}

testEmail(); 