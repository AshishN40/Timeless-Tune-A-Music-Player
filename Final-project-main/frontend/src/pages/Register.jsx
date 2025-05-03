import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/User";
import { SongData } from "../context/Song";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [otp, setOtp] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const { registerUser, btnLoading } = UserData();
  const navigate = useNavigate();
  const { fetchSongs, fetchAlbums } = SongData();

  const backgroundImages = [
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Music studio
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Vinyl records
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Headphones
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Piano keys
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Guitar strings
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Vinyl records
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Headphones
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Piano keys
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Guitar strings
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Vinyl records
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Vinyl records
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Headphones
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Piano keys
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Guitar strings
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Vinyl records
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const validatePassword = (currentConfirmPassword = confirmPassword) => {
    if (password !== currentConfirmPassword) {
      setPasswordMatch(false);
      return false;
    }
    setPasswordMatch(true);
    return true;
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (!validatePassword()) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/otp/send", { email });
      if (response.data.message === "OTP sent successfully") {
        setShowOTPInput(true);
        setOtpSent(true);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post("/api/otp/verify", { email, otp });
      if (response.data.message === "OTP verified successfully") {
        await registerUser(name, email, password, navigate, fetchSongs, fetchAlbums);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex items-center justify-center h-screen max-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="bg-black bg-opacity-80 text-white p-8 rounded-lg shadow-lg max-w-md w-full relative z-10 backdrop-blur-sm">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Register to Timeless 
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-md text-red-500 text-sm">
            {error}
          </div>
        )}

        <form className="mt-8" onSubmit={showOTPInput ? verifyOTP : sendOTP}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 rounded-md bg-white bg-opacity-10 border border-gray-600 focus:outline-none focus:border-green-500 text-white placeholder-gray-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-md bg-white bg-opacity-10 border border-gray-600 focus:outline-none focus:border-green-500 text-white placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-2 rounded-md bg-white bg-opacity-10 border border-gray-600 focus:outline-none focus:border-green-500 text-white placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className={`w-full px-4 py-2 rounded-md bg-white bg-opacity-10 border ${
                  !passwordMatch ? 'border-red-500' : 'border-gray-600'
                } focus:outline-none focus:border-green-500 text-white placeholder-gray-400`}
                value={confirmPassword}
                onChange={(e) => {
                  const newConfirmPassword = e.target.value;
                  setConfirmPassword(newConfirmPassword);
                  validatePassword(newConfirmPassword);
                }}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {!passwordMatch && (
              <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
            )}
          </div>

          {showOTPInput && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Enter OTP</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="w-full px-4 py-2 rounded-md bg-white bg-opacity-10 border border-gray-600 focus:outline-none focus:border-green-500 text-white placeholder-gray-400"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <p className="text-sm text-gray-400 mt-1">
                Please check your email for the OTP
              </p>
            </div>
          )}

          <button 
            disabled={loading || btnLoading || !passwordMatch} 
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Please Wait..." : showOTPInput ? "Verify OTP" : "Send OTP"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm text-gray-400 hover:text-white transition duration-300"
          >
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;