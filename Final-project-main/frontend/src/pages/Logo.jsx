import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets.js'

const Logo = () => {
  const navigate = useNavigate()
  const audioRef = useRef(null)

  useEffect(() => {
    const playAudio = async () => {
      try {
        if (audioRef.current) {
          // Set volume to 0 initially
          audioRef.current.volume = 0;
          // Attempt to play
          await audioRef.current.play();
          // Gradually increase volume
          audioRef.current.volume = 1;
        }
      } catch (error) {
        console.log("Audio autoplay failed:", error);
        // If autoplay fails, we'll still continue with navigation
      }
    };

    playAudio();

    const timer = setTimeout(() => {
      navigate('/login')
    }, 5000)
    
    return () => {
      clearTimeout(timer)
    }
  }, [navigate])

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center">
      <img 
        src={assets.logos} 
        alt="Logo" 
        className="w-[70vw] bg-black animate-test-animation logo-image"
      />
      <audio 
        ref={audioRef} 
        src={assets.logo_music}
        preload="auto"
        muted={false}
      ></audio>
    </div>
  )
}

export default Logo
