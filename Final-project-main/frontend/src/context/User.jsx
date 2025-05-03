import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function registerUser(
    name,
    email,
    password,
    navigate,
    fetchSongs,
    fetchAlbums
  ) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/register", {
        name,
        email,
        password,
      });

      toast.success(data.message);
      setUser(data.user);
      setAllUsers(prevUsers => [...prevUsers, {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        password: data.user.plainPassword
      }]);
      setBtnLoading(false);
      navigate("/login");
      fetchSongs();
      fetchAlbums();
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  async function loginUser(email, password, navigate, fetchSongs, fetchAlbums) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/login", {
        email,
        password,
      });

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/Home");
      fetchSongs();
      fetchAlbums();
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await axios.get("/api/user/me");

      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setIsAuth(false);
      setLoading(false);
    }
  }

  async function logoutUser() {
    try {
      const { data } = await axios.get("/api/user/logout");

      window.location.reload();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function addToPlaylist(id, playlistName) {
    try {
      const { data } = await axios.post("/api/user/playlist", {
        songId: id,
        playlistName: playlistName
      });

      toast.success(data.message);
      fetchUser();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function createPlaylist(playlistName) {
    try {
      const { data } = await axios.post("/api/user/playlist/create", {
        playlistName: playlistName
      });

      toast.success(data.message);
      fetchUser();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function removeFromPlaylist(songId, playlistName) {
    try {
      const { data } = await axios.delete(`/api/user/playlist/${playlistName}/song/${songId}`);
      toast.success(data.message);
      fetchUser();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function deletePlaylist(playlistName) {
    try {
      const { data } = await axios.delete(`/api/user/playlist/${playlistName}`);
      toast.success(data.message);
      fetchUser();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function fetchAllUsers() {
    try {
      const { data } = await axios.get("/api/user/all");
      setAllUsers(data.users);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUser();
    fetchAllUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        registerUser,
        user,
        isAuth,
        btnLoading,
        loading,
        loginUser,
        logoutUser,
        addToPlaylist,
        createPlaylist,
        removeFromPlaylist,
        deletePlaylist,
        allUsers,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);