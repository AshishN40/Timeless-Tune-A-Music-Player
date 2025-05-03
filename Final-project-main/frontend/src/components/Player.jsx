import React, { useEffect, useRef, useState } from 'react'
import { SongData } from '../context/Song'
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { FaPause, FaPlay } from 'react-icons/fa6';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';

const truncateText = (text, wordCount) => {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length > wordCount) {
    return words.slice(0, wordCount).join(' ') + '...';
  }
  return text;
};

const MarqueeText = ({ text }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-marquee">
        <span className="inline-block">{text}</span>
        <span className="inline-block ml-4">{text}</span>
      </div>
    </div>
  );
};

const Player = () => {
    const { song, fetchSingleSong, selectedSong, isPlaying, setIsPlaying, nextMusic, prevMusic  } = SongData();
    console.log(song);

    useEffect(() => {
        fetchSingleSong();
    }, [selectedSong]);

    const audioRef = useRef(null);
    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        }
        else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };
   
    const [volume, setVolume] = useState(1);
    const [showVolume, setShowVolume] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [previousVolume, setPreviousVolume] = useState(1);

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (isMuted) {
            // Unmute - restore previous volume
            setVolume(previousVolume);
            audioRef.current.volume = previousVolume;
        } else {
            // Mute - save current volume and set to 0
            setPreviousVolume(volume);
            setVolume(0);
            audioRef.current.volume = 0;
        }
        setIsMuted(!isMuted);
    };
     
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        const handleloadedMetaData = () => {
            setDuration(audio.duration);
        };
        const handleTimeUpdate = () => {
            setProgress(audio.currentTime);
        };
        const handleEnded = () => {
            nextMusic();
        };

        audio.addEventListener("loadedmetadata", handleloadedMetaData);
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("loadedmetadata", handleloadedMetaData);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [song]);

    const handleProgressChange  = (e)=>{
        const newTime = (e.target.value/100) * duration;
        audioRef.current.currentTime = newTime;
        setProgress(newTime);
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return <div>{
        song && <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-gradient-to-r from-black to-gray-900 flex justify-between items-center text-white px-4 md:px-8 py-2 shadow-lg border-t border-gray-800">
            {/* Left Section - Song Info */}
            <div className="flex items-center gap-4 w-1/3">
                <img 
                    src={song.thumbnail ? song.thumbnail.url : "https://placehold.co/50"} 
                    className='w-14 h-14 rounded-md object-cover shadow-lg transition-transform hover:scale-105' 
                    alt="" 
                />
                <div className="hidden md:block min-w-0">
                    <div className="max-w-[200px]">
                        <MarqueeText 
                            text={song?.title}
                        />
                    </div>
                    <div className="max-w-[200px]">
                        <MarqueeText 
                            text={song?.description}
                        />
                    </div>
                </div>
            </div>

            {/* Center Section - Controls */}
            <div className="flex flex-col items-center gap-2 w-1/3">
                {song && song.audio && <>
                    {isPlaying ? <audio ref={audioRef} src={song.audio.url} autoPlay /> : <audio ref={audioRef} src={song.audio.url} />}
                </>}
                
                {/* Progress Bar */}
                <div className="w-full flex items-center gap-2">
                    <span className="text-xs text-gray-400">{formatTime(progress)}</span>
                    <input 
                        type='range' 
                        min="0" 
                        max="100" 
                        className='progress-bar w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer hover:bg-gray-500 transition-colors' 
                        value={(progress / duration) * 100} 
                        onChange={handleProgressChange}
                    />
                    <span className="text-xs text-gray-400">{formatTime(duration)}</span>
                </div>

                {/* Playback Controls */}
                <div className="flex justify-center items-center gap-6">
                    <button 
                        className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"
                        onClick={prevMusic}
                    >
                        <MdSkipPrevious size={24} />
                    </button>
                    <button 
                        className='bg-white text-black rounded-full p-3 hover:scale-105 transition-transform shadow-lg hover:shadow-xl' 
                        onClick={handlePlayPause}
                    >
                        {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                    </button>
                    <button 
                        className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"
                        onClick={nextMusic}
                    >
                        <MdSkipNext size={24} />
                    </button>
                </div>
            </div>

            {/* Right Section - Volume */}
            <div className="flex items-center gap-2 w-1/3 justify-end">
                <button 
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={toggleMute}
                >
                    {isMuted ? <HiSpeakerXMark size={20} /> : <HiSpeakerWave size={20} />}
                </button>
                {showVolume && (
                    <input 
                        type='range' 
                        className='w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer hover:bg-gray-500 transition-colors' 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={volume} 
                        onChange={handleVolumeChange}
                    />
                )}
            </div>
        </div>
    }
    </div>
}

export default Player