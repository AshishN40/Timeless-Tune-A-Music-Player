import React, { useEffect, useState } from 'react'
import { FaBookmark, FaPlay, FaRegBookmark, FaPlus } from 'react-icons/fa6'
import { UserData } from '../context/User';
import { SongData } from '../context/Song';

const truncateText = (text, wordCount) => {
  const words = text.split(' ');
  if (words.length > wordCount) {
    return words.slice(0, wordCount).join(' ') + '...';
  }
  return text;
};

const SongItem = ({ image, name, id, desc }) => {
    const [saved, setSaved] = useState(false);
    const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
    const {addToPlaylist, user, createPlaylist} = UserData();
    const {setSelectedSong, isPlaying, setIsPlaying} = SongData();
    const [newPlaylistName, setNewPlaylistName] = useState("");

    useEffect(() => {
        if (user.playlists) {
            const isInAnyPlaylist = Object.values(user.playlists).some(playlist => 
                playlist.includes(id)
            );
            setSaved(isInAnyPlaylist);
        }
    }, [user, id]);

    const savePlaylistHandler = async (playlistName) => {
        if (!playlistName) {
            setShowPlaylistMenu(true);
            return;
        }
        
        if (playlistName === "new") {
            if (newPlaylistName.trim()) {
                await createPlaylist(newPlaylistName);
                await addToPlaylist(id, newPlaylistName);
                setNewPlaylistName("");
                setShowPlaylistMenu(false);
            }
        } else {
            await addToPlaylist(id, playlistName);
            setShowPlaylistMenu(false);
        }
    };

    return (
        <div className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]'>
            <div className="relative group">
                <img src={image} className='rounded w-[160px]' alt='' />
                <div className="flex gap-2">
                    <button 
                        className='absolute bottom-2 right-14 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300' 
                        onClick={() => {
                            setSelectedSong(id);
                            setIsPlaying(true);
                        }}
                    >
                        <FaPlay/>
                    </button>
                    <button 
                        className='absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300' 
                        onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
                    >
                        {saved ? <FaBookmark/> : <FaRegBookmark/>}
                    </button>
                </div>
            </div>
            <p className="font-bold mt-2 mb-1 w-[160px] truncate">{truncateText(name, 15)}</p>
            <p className="text-slate-200 text-sm w-[160px] truncate">{truncateText(desc, 15)}</p>

            {showPlaylistMenu && (
                <div className="absolute z-50 bg-[#282828] p-4 rounded-lg shadow-lg mt-2 w-[200px]">
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold mb-2">Add to Playlist</h3>
                        {user.playlists && Object.keys(user.playlists).map((playlistName) => (
                            <button
                                key={playlistName}
                                onClick={() => savePlaylistHandler(playlistName)}
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
                                onClick={() => savePlaylistHandler("new")}
                                className="bg-[#1db954] px-3 py-1 rounded hover:bg-[#1ed760]"
                            >
                                <FaPlus />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SongItem