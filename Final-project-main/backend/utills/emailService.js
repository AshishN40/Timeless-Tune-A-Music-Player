import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Using 'gmail' service instead of manual host/port
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD  // This should be an App Password if 2FA is enabled
  },
  debug: true, // Enable debug output
  logger: true // Log information to the console
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('SMTP connection error:', error);
    console.log('Email configuration:');
    console.log('User:', process.env.EMAIL_USER);
    console.log('Password is set:', !!process.env.EMAIL_PASSWORD);
    
    if (error.code === 'EAUTH') {
      console.log('\nPossible solutions:');
      console.log('1. Ensure 2FA is enabled on your Google Account');
      console.log('2. Use an App Password instead of your regular password:');
      console.log('   - Go to Google Account Settings');
      console.log('   - Search for "App Passwords"');
      console.log('   - Generate a new App Password for "Mail" and "Other (Custom name)"');
      console.log('   - Use that 16-character password in your .env file');
      console.log('3. Ensure the EMAIL_USER and EMAIL_PASSWORD in .env are correct');
    }
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

export const sendOTPEmail = async (email, otp) => {
  try {
    // Validate email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Email configuration is missing. Please check your .env file.');
    }

    const mailOptions = {
      from: {
        name: "Timeless Tune",
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Your OTP for email verification is:</p>
          <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Please check your email credentials.');
    }
    throw error; // Re-throw to handle in the route
  }
};