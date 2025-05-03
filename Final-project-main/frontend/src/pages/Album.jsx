import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { SongData } from "../context/Song.jsx";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { UserData } from "../context/User.jsx";
import { FaBookmark, FaPlay, FaPlus } from "react-icons/fa";

const Album = () => {
  const {
    fetchAlbumSong,
    albumSong,
    albumData,
    setIsPlaying,
    setSelectedSong,
    setAlbum,
  } = SongData();

  const params = useParams();
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const { addToPlaylist, createPlaylist, user } = UserData();

  useEffect(() => {
    fetchAlbumSong(params.id);
  }, [params.id]);

  const onclickHander = (id) => {
    if (albumSong) {
      setAlbum(albumSong);
      setIsPlaying(true);
    } else {
      setSelectedSong(id);
      setIsPlaying(true);
    }
  };

  const savePlaylistHandler = async (songId, playlistName) => {
    if (!playlistName) {
      setShowPlaylistMenu(songId);
      return;
    }
    
    if (playlistName === "new") {
      if (newPlaylistName.trim()) {
        await createPlaylist(newPlaylistName);
        await addToPlaylist(songId, newPlaylistName);
        setNewPlaylistName("");
        setShowPlaylistMenu(null);
      }
    } else {
      await addToPlaylist(songId, playlistName);
      setShowPlaylistMenu(null);
    }
  };

  return (
    <Layout>
      {albumData && (
        <>
          <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-center">
            {albumData.thumbnail && (
              <img
                src={albumData.thumbnail.url}
                className="w-48 rounded"
                alt=""
              />
            )}

            <div className="flex flex-col">
              <p>Album</p>
              <h2 className="text-3xl font-bold mb-4 md:text-5xl">
                {albumData.title} Album
              </h2>
              <h4>{albumData.description}</h4>
              <p className="mt-1">
                <img
                  src={assets.spotify_logo}
                  className="inline-block w-6"
                  alt=""
                />
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
            <p>
              <b className="mr-4">#</b>
            </p>
            <p>Artist</p>
            <p className="hidden sm:block">Description</p>
            <p className="text-center">Actions</p>
          </div>

          <hr />
          {albumSong &&
            albumSong.map((e, i) => (
              <div
                className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer relative"
                key={i}
              >
                <p className="text-white">
                  <b className="mr-4 text-[#a7a7a7]">{i + 1}</b>
                  <img
                    src={e.thumbnail.url}
                    className="inline w-10 mr-5"
                    alt=""
                  />
                  {e.title}
                </p>
                <p className="text-[15px]">{e.singer}</p>
                <p className="text-[15px] hidden sm:block">
                  {e.description.slice(0, 20)}...
                </p>
                <p className="flex justify-center items-center gap-5">
                  <p
                    className="text-[15px] text-center cursor-pointer"
                    onClick={() => savePlaylistHandler(e._id)}
                  >
                    <FaBookmark />
                  </p>
                  <p
                    className="text-[15px] text-center cursor-pointer"
                    onClick={() => onclickHander(e._id)}
                  >
                    <FaPlay />
                  </p>
                </p>

                {showPlaylistMenu === e._id && (
                  <div className="absolute z-50 right-0 top-full bg-[#282828] p-4 rounded-lg shadow-lg mt-2 w-[200px]">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-bold mb-2">Add to Playlist</h3>
                      {user.playlists && Object.keys(user.playlists).map((playlistName) => (
                        <button
                          key={playlistName}
                          onClick={() => savePlaylistHandler(e._id, playlistName)}
                          className="text-left hover:bg-[#383838] p-2 rounded"
                        >
                          {playlistName}
                        </button>
                      ))}
                      <div className="border-t border-gray-700 my-2"></div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newPlaylistName}
                          onChange={(e) => setNewPlaylistName(e.target.value)}
                          placeholder="New playlist name"
                          className="flex-1 px-2 py-1 rounded bg-[#383838] text-white"
                        />
                        <button
                          onClick={() => savePlaylistHandler(e._id, "new")}
                          className="bg-[#1db954] px-3 py-1 rounded hover:bg-[#1ed760]"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </>
      )}
    </Layout>
  );
};

export default Album;