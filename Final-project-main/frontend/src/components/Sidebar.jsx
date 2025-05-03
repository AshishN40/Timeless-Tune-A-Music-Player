import React, { useState } from "react";

import { assets } from "../assets/assets.js";
import { SongData } from "../context/Song.jsx";

import { useNavigate } from "react-router-dom";
import PlayListCard from "./PlayListCard.jsx";
import { UserData } from "../context/User.jsx";

const Sidebar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
const { user } = UserData();
const { songs, setSelectedSong, setIsPlaying } = SongData();


  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.singer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (song.movie && song.movie.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      <div className="bg-[#121212] h-[15%] rounded flex flex-col justify-around">
        <div
          className="flex items-center gap-3 pl-8 cursor-pointer"
          onClick={() => navigate("/Home")}
        >
          <img src={assets.home_icon} className="w-6" alt="" />
          <p className="font-bold">Home</p>
        </div>
        <div
          className="flex items-center gap-3 pl-8 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={assets.search_icon} className="w-6" alt="" />
          <p className="font-bold">Search</p>
        </div>
      </div>

      <div className={`bg-[#121212] rounded flex flex-col ${searchQuery ? 'h-[90%]' : 'h-[85%]'}`}>

        {/* Search Input */}
        <div className="p-4">
          <div className="flex items-center gap-2 bg-[#2a2a2a] rounded-full px-4 py-2">
            <img src={assets.search_icon} className="w-4" alt="Search" />
            <input
              type="text"
              placeholder="Search by song, singer, or movie..."
              className="bg-transparent w-full text-white focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Search Results */}
        <div className={`overflow-y-auto px-4 ${searchQuery ? 'flex-1' : 'h-0'}`}>

          {searchQuery && (
            <>
              <h3 className="text-sm font-semibold mb-2">Search Results</h3>
              <div className="space-y-2">
                {filteredSongs.length > 0 ? (
                  filteredSongs.map((song) => (
                    <div
                      key={song._id}
                      className="p-2 hover:bg-[#2a2a2a] rounded cursor-pointer"
                      onClick={() => {
                        setSelectedSong(song._id);
                        setIsPlaying(true);
                      }}
                    >
                      <p className="text-sm truncate">{song.title}</p>
                      <p className="text-xs text-gray-400 truncate">{song.singer}</p>
                      {song.movie && (
                        <p className="text-xs text-gray-500 truncate">Movie: {song.movie}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No songs found</p>
                )}
              </div>
            </>
          )}
        </div>

     
        <div onClick={() => navigate("/playlist")}>
          <PlayListCard />
        </div>

        

        {user && user.role === "admin" && (
          <button
            className="px-4 py-1.5 bg-white text-black text-[15px] rounded-full mt-4"
            onClick={() => navigate("/admin")}
          >
            Admin Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
