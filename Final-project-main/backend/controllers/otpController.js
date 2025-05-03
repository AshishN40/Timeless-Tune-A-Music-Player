import OTP from '../models/OTP.js';
import { sendOTPEmail } from '../utills/emailService.js';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Generate OTP
    const otp = generateOTP();
    
    // Save OTP to database
    await OTP.findOneAndDelete({ email }); // Delete any existing OTP
    await OTP.create({ email, otp });
    
    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp);
    
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }
    
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error in sendOTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const otpRecord = await OTP.findOne({ email });
    
    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }
    
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    // Delete the OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });
    
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};