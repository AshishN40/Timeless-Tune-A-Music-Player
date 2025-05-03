import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with explicit path
dotenv.config({ path: path.join(__dirname, '.env') });

// Log all environment variables (password will be masked)
console.log('Environment variables loaded:');
console.log('Current directory:', __dirname);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Password is set' : 'Password is NOT set');

// Create transporter with explicit configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER?.trim(),
    pass: process.env.EMAIL_PASSWORD?.trim()
  }
});

// Test the connection
async function testConnection() {
  try {
    await transporter.verify();
    console.log('SMTP connection successful!');
  } catch (error) {
    console.error('SMTP connection failed:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    console.error('Current environment variables:');
    console.error('EMAIL_USER:', process.env.EMAIL_USER);
    console.error('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Password is set' : 'Password is NOT set');
  }
}

testConnection(); 