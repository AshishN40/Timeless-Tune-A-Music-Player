import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/User";
import { SongData } from "../context/Song";
import axios from "axios";
import { FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [showUserList, setShowUserList] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser, btnLoading, allUsers } = UserData();
  const { fetchSongs, fetchAlbums } = SongData();
  const navigate = useNavigate();

  const backgroundImages = [
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Music studio
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Vinyl records
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Headphones
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Piano keys
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80", // Guitar strings
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check for stored credentials and auto-fill them
    const storedEmail = localStorage.getItem('userEmail');
    const storedPassword = localStorage.getItem('userPassword');
    
    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
    }
  }, []);

  const handleUserSelect = (selectedUser) => {
    setEmail(selectedUser.email);
    setPassword(selectedUser.password);
    setShowUserList(false);
    // Store the selected credentials
    localStorage.setItem('userEmail', selectedUser.email);
    localStorage.setItem('userPassword', selectedUser.password);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setShowUserList(true);
    
    // Find user by email and auto-fill password if found
    const selectedUser = allUsers.find(user => user.email === newEmail);
    if (selectedUser) {
      setPassword(selectedUser.password);
      localStorage.setItem('userEmail', selectedUser.email);
      localStorage.setItem('userPassword', selectedUser.password);
    }
  };

  const handleDeleteUser = async (e, userEmail) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    setLoading(true);
    setError("");

    try {
      // Delete user from database
      const response = await axios.delete(`/api/user/delete/${userEmail}`);
      
      if (response.data.message === "User deleted successfully") {
        // Remove from localStorage
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPassword');
        
        // Clear form fields
        setEmail('');
        setPassword('');
        setShowUserList(false);
        
        // Show success message
        setError("User deleted successfully");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    loginUser(email, password, navigate, fetchSongs, fetchAlbums);
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
          Login to Timeless
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-md text-red-500 text-sm">
            {error}
          </div>
        )}

        <form className="mt-8" onSubmit={submitHandler}>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1">
              Email or username
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Email or Username"
                className="w-full px-4 py-2 rounded-md bg-white bg-opacity-10 border border-gray-600 focus:outline-none focus:border-green-500 text-white placeholder-gray-400"
                value={email}
                onChange={handleEmailChange}
                onFocus={() => setShowUserList(true)}
                required
              />
              {showUserList && allUsers.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-black bg-opacity-90 border border-gray-600 rounded-md max-h-48 overflow-y-auto">
                  {allUsers.map((user) => (
                    <div
                      key={user._id}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div>
                        <div className="text-white">{user.email}</div>
                        <div className="text-sm text-gray-400">{user.name}</div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteUser(e, user.email)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                        title="Remove credentials"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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

          <button 
            disabled={btnLoading || loading} 
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Please Wait..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/register"
            className="text-sm text-gray-400 hover:text-white transition duration-300 block"
          >
            Don't have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;