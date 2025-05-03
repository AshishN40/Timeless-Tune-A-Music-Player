import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { SongData } from "../context/Song";
import { assets } from "../assets/assets";
import { FaBookmark, FaPlay, FaPlus, FaTrash, FaTimes } from "react-icons/fa";
import { UserData } from "../context/User";

const PlayList = ({ user }) => {
  const { songs, setSelectedSong, setIsPlaying, setPlaylist } = SongData();
  const { addToPlaylist, createPlaylist, removeFromPlaylist, deletePlaylist } = UserData();
  const [myPlaylists, setMyPlaylists] = useState({});
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);

  useEffect(() => {
    if (songs && user && user.playlists) {
      const playlistsWithSongs = {};
      Object.entries(user.playlists).forEach(([playlistName, songIds]) => {
        playlistsWithSongs[playlistName] = songs.filter((song) =>
          songIds.includes(song._id.toString())
        );
      });
      setMyPlaylists(playlistsWithSongs);
      if (Object.keys(playlistsWithSongs).length > 0 && !selectedPlaylist) {
        setSelectedPlaylist(Object.keys(playlistsWithSongs)[0]);
      }
    }
  }, [songs, user]);

  const onclickHander = (id) => {
    if (selectedPlaylist && myPlaylists[selectedPlaylist]) {
      setPlaylist(myPlaylists[selectedPlaylist]);
      setIsPlaying(true);
    } else {
      setSelectedSong(id);
      setIsPlaying(true);
    }
  };

  const handleCreatePlaylist = async () => {
    if (newPlaylistName.trim()) {
      await createPlaylist(newPlaylistName);
      setNewPlaylistName("");
      setShowCreatePlaylist(false);
    }
  };

  const handleAddToPlaylist = async (songId) => {
    if (selectedPlaylist) {
      await addToPlaylist(songId, selectedPlaylist);
    }
  };

  const handleRemoveFromPlaylist = async (songId) => {
    if (selectedPlaylist) {
      await removeFromPlaylist(songId, selectedPlaylist);
    }
  };

  const handleDeletePlaylist = async (playlistName) => {
    setPlaylistToDelete(playlistName);
    setShowDeleteConfirmation(true);
  };

  const confirmDeletePlaylist = async () => {
    if (playlistToDelete) {
      await deletePlaylist(playlistToDelete);
      if (selectedPlaylist === playlistToDelete) {
        setSelectedPlaylist(null);
      }
      setShowDeleteConfirmation(false);
      setPlaylistToDelete(null);
    }
  };

  return (
    <Layout>
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-center">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold mb-4 md:text-5xl">Your Playlists</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreatePlaylist(true)}
              className="flex items-center gap-2 bg-[#1db954] px-4 py-2 rounded-full hover:bg-[#1ed760]"
            >
              <FaPlus /> Create New Playlist
            </button>
          </div>
          {showCreatePlaylist && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Enter playlist name"
                className="px-4 py-2 rounded bg-[#282828] text-white"
              />
              <button
                onClick={handleCreatePlaylist}
                className="bg-[#1db954] px-4 py-2 rounded hover:bg-[#1ed760]"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreatePlaylist(false)}
                className="bg-[#282828] px-4 py-2 rounded hover:bg-[#383838]"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-4 flex-wrap">
        {Object.keys(myPlaylists).map((playlistName) => (
          <button
            key={playlistName}
            onClick={() => setSelectedPlaylist(playlistName)}
            className={`px-4 py-2 rounded-full ${
              selectedPlaylist === playlistName
                ? "bg-[#1db954]"
                : "bg-[#282828] hover:bg-[#383838]"
            }`}
          >
            {playlistName}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePlaylist(playlistName);
              }}
              className="ml-2 text-red-500 hover:text-red-600"
            >
              <FaTrash />
            </button>
          </button>
        ))}
      </div>

      {selectedPlaylist && (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
            <p>
              <b className="mr-4">#</b>
            </p>
            <p>Artist</p>
            <p className="hidden sm:block">Description</p>
            <p className="text-center">Actions</p>
          </div>
          <hr />
          {myPlaylists[selectedPlaylist].map((e, i) => (
            <div
              className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
              key={i}
            >
              <p className="text-white">
                <b className="mr-4 text-[#a7a7a7]">{i + 1}</b>
                <img src={e.thumbnail.url} className="inline w-10 mr-5" alt="" />
                {e.title}
              </p>
              <p className="text-[15px]">{e.singer}</p>
              <p className="text-[15px] hidden sm:block">
                {e.description.slice(0, 20)}...
              </p>
              <p className="flex justify-center items-center gap-5">
                <p
                  className="text-[15px] text-center text-red-500"
                  onClick={() => handleRemoveFromPlaylist(e._id)}
                >
                  <FaTrash />
                </p>
                <p
                  className="text-[15px] text-center"
                  onClick={() => onclickHander(e._id)}
                >
                  <FaPlay />
                </p>
              </p>
            </div>
          ))}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#282828] p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Delete Playlist</h3>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            <p className="mb-6">
              Are you sure you want to delete the playlist "{playlistToDelete}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 rounded bg-[#383838] hover:bg-[#484848]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePlaylist}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PlayList;