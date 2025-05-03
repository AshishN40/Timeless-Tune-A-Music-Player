import { User } from "../models/User.js";
import TryCatch from "../utills/TryCatch.js";
import bcrypt from "bcrypt";
import generateToken from "../utills/generateToken.js";

export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user)
    return res.status(400).json({
      message: "User Already Exists",
    });

  const hashPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashPassword,
    plainPassword: password,
  });

  generateToken(user._id, res);

  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      plainPassword: user.plainPassword,
    },
    message: "User Registered",
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({
      message: "No User Exist",
    });

  if (password !== user.plainPassword)
    return res.status(400).json({
      message: "Wrong Password",
    });

  generateToken(user._id, res);

  res.status(200).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      plainPassword: user.plainPassword,
      role: user.role,
    },
    message: user.role === "admin" ? "Admin LoggedIN" : "User LoggedIN",
  });
});

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json(user);
});

export const logoutUser = TryCatch(async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });

  res.json({
    message: "Logged Out Successfully",
  });
});

export const saveToPlaylist = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { songId, playlistName } = req.body;

  if (!user.playlists.has(playlistName)) {
    return res.status(404).json({
      message: "Playlist not found",
    });
  }

  const playlist = user.playlists.get(playlistName);
  
  if (playlist.includes(songId)) {
    const index = playlist.indexOf(songId);
    playlist.splice(index, 1);
    await user.save();
    return res.json({
      message: "Removed from playlist",
    });
  }

  playlist.push(songId);
  await user.save();

  return res.json({
    message: "Added to playlist",
  });
});

export const createPlaylist = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { playlistName } = req.body;

  if (user.playlists.has(playlistName)) {
    return res.status(400).json({
      message: "Playlist already exists",
    });
  }

  user.playlists.set(playlistName, []);
  await user.save();

  return res.status(201).json({
    message: "Playlist created successfully",
  });
});

export const removeFromPlaylist = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { playlistName, songId } = req.params;

  if (!user.playlists.has(playlistName)) {
    return res.status(404).json({
      message: "Playlist not found",
    });
  }

  const playlist = user.playlists.get(playlistName);
  const index = playlist.indexOf(songId);

  if (index === -1) {
    return res.status(404).json({
      message: "Song not found in playlist",
    });
  }

  playlist.splice(index, 1);
  await user.save();

  return res.json({
    message: "Song removed from playlist",
  });
});

export const deletePlaylist = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { playlistName } = req.params;

  if (!user.playlists.has(playlistName)) {
    return res.status(404).json({
      message: "Playlist not found",
    });
  }

  user.playlists.delete(playlistName);
  await user.save();

  return res.json({
    message: "Playlist deleted successfully",
  });
});

export const getAllUsers = TryCatch(async (req, res) => {
  const users = await User.find({}, 'name email plainPassword');
  
  res.status(200).json({
    users: users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.plainPassword
    })),
    message: "Users fetched successfully"
  });
});

export const resetPassword = TryCatch(async (req, res) => {
  const { email, newPassword } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update both hashed and plain passwords
  user.password = hashedPassword;
  user.plainPassword = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful"
  });
});

export const deleteUser = TryCatch(async (req, res) => {
  const { email } = req.params;

  // Find and delete user by email
  const user = await User.findOneAndDelete({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
});

export const makeUserAdmin = TryCatch(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  user.role = "admin";
  await user.save();

  res.status(200).json({
    success: true,
    message: "User role updated to admin successfully"
  });
});