import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const SongContext = createContext();

export const SongProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [songLoading, setSongLoading] = useState(true);
  const [albums, setAlbums] = useState([]);

  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function fetchSongs() {
    try {
      const { data } = await axios.get("/api/song/all");

      setSongs(data);
      setSelectedSong(data[0]._id);
      setIsPlaying(false);
    } catch (error) {
      console.log(error);
    }
  }

  const [song, setSong] = useState([]);

  async function fetchSingleSong() {
    try {
      const { data } = await axios.get("/api/song/single/" + selectedSong);

      setSong(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function addAlbum(formData, setTitle, setDescription, setFile) {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/song/album/new", formData);
      toast.success(data.message);
      setLoading(false);
      fetchAlbums();
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }

  async function addSong(
    formData,
    setTitle,
    setDescription,
    setFile,
    setSinger,
    setAlbum,
    setMovie
  ) {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/song/new", formData);
      toast.success(data.message);
      setLoading(false);
      fetchSongs();
      setTitle("");
      setDescription("");
      setFile(null);
      setSinger("");
      setAlbum("");
      setMovie("");
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }

  async function addThumbnail(id, formData, setFile) {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/song/" + id, formData);
      toast.success(data.message);
      setLoading(false);
      fetchSongs();
      setFile(null);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }

  async function fetchAlbums() {
    try {
      const { data } = await axios.get("/api/song/album/all");

      setAlbums(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteSong(id) {
    try {
      const { data } = await axios.delete("/api/song/" + id);

      toast.success(data.message);
      fetchSongs();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, []);

  const [index, setIndex] = useState(0);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [currentAlbum, setCurrentAlbum] = useState(null);

  function nextMusic() {
    let nextIndex;
    let nextSongId;
    
    if (currentPlaylist) {
      // Handle playlist playback
      nextIndex = (index + 1) % currentPlaylist.length;
      nextSongId = currentPlaylist[nextIndex]._id;
    } else if (currentAlbum) {
      // Handle album playback
      nextIndex = (index + 1) % currentAlbum.length;
      nextSongId = currentAlbum[nextIndex]._id;
    } else {
      // Handle regular song list playback
      nextIndex = (index + 1) % songs.length;
      nextSongId = songs[nextIndex]._id;
    }
    
    setIndex(nextIndex);
    setSelectedSong(nextSongId);
  }

  function prevMusic() {
    if (index === 0) {
      return null;
    }
    
    let prevIndex;
    let prevSongId;
    
    if (currentPlaylist) {
      prevIndex = index - 1;
      prevSongId = currentPlaylist[prevIndex]._id;
    } else if (currentAlbum) {
      prevIndex = index - 1;
      prevSongId = currentAlbum[prevIndex]._id;
    } else {
      prevIndex = index - 1;
      prevSongId = songs[prevIndex]._id;
    }
    
    setIndex(prevIndex);
    setSelectedSong(prevSongId);
  }

  const setPlaylist = (playlist) => {
    setCurrentPlaylist(playlist);
    setCurrentAlbum(null);
    setIndex(0);
    if (playlist && playlist.length > 0) {
      setSelectedSong(playlist[0]._id);
    }
  };

  const setAlbum = (album) => {
    setCurrentAlbum(album);
    setCurrentPlaylist(null);
    setIndex(0);
    if (album && album.length > 0) {
      setSelectedSong(album[0]._id);
    }
  };

  const [albumSong, setAlbumSong] = useState([]);
  const [albumData, setAlbumData] = useState([]);

  async function fetchAlbumSong(id) {
    try {
      const { data } = await axios.get("/api/song/album/" + id);
      setAlbumSong(data.songs);
      setAlbumData(data.album);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <SongContext.Provider
      value={{
        songs,
        addAlbum,
        loading,
        songLoading,
        albums,
        addSong,
        addThumbnail,
        deleteSong,
        fetchSingleSong,
        song,
        setSelectedSong,
        isPlaying,
        setIsPlaying,
        selectedSong,
        nextMusic,
        prevMusic,
        fetchAlbumSong,
        albumSong,
        albumData,
        fetchSongs,
        fetchAlbums,
        setPlaylist,
        setAlbum,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const SongData = () => useContext(SongContext);