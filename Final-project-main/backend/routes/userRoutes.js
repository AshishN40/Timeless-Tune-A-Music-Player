import express from 'express';
import { 
  loginUser, 
  logoutUser, 
  myProfile, 
  registerUser, 
  saveToPlaylist,
  createPlaylist,
  removeFromPlaylist,
  deletePlaylist,
  getAllUsers,
  resetPassword,
  deleteUser,
  makeUserAdmin
} from '../controllers/userControllers.js';

import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router()

router.post("/register", registerUser);


router.post("/login", loginUser);
router.get("/me", isAuth, myProfile);
router.get("/logout", isAuth, logoutUser);
router.get("/all", getAllUsers);
router.post("/reset-password", resetPassword);
router.delete("/delete/:email", deleteUser);
router.post("/make-admin", makeUserAdmin);

// Playlist routes
router.post("/playlist", isAuth, saveToPlaylist);
router.post("/playlist/create", isAuth, createPlaylist);
router.delete("/playlist/:playlistName/song/:songId", isAuth, removeFromPlaylist);
router.delete("/playlist/:playlistName", isAuth, deletePlaylist);

export default router;