"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Plus, Minus } from "lucide-react";
import { Button } from "@heroui/button";

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface MusicPlayerProps {
  audioSrc: string;
  audioType?: string;
  position?: Position;
  songName?: string;
}

export function MusicPlayer({ audioSrc, audioType = "audio/mpeg", position = "bottom-right", songName }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Connect to the audio element after component mounts
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;
    
    const handleCanPlayThrough = () => {
    //   console.log("Audio can play through");
      setAudioLoaded(true);
      setAudioError(false);
    };
    
    const handleError = (e: Event) => {
    //   console.error("Error loading audio:", e);
      setAudioError(true);
      setIsPlaying(false);
    };

    const handleLoadedData = () => {
    //   console.log("Audio data loaded");
      setAudioLoaded(true);
    };
    
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadeddata', handleLoadedData);
    
    // Force load the audio
    audio.load();
    
    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  // Handle play/pause state changes with better race condition handling
  useEffect(() => {
    if (!audioRef.current) return;
    
    let playPromise: Promise<void> | undefined;
    
    const handlePlay = async () => {
      try {
        // Only attempt to play if not already playing
        if (audioRef.current && audioRef.current.paused) {
          playPromise = audioRef.current.play();
          
          if (playPromise !== undefined) {
            await playPromise;
            // console.log("Audio playback started successfully");
          }
        }
      } catch (error) {
        // Ignore AbortError as it's expected when quickly toggling play/pause
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
          setAudioError(true);
        }
      }
    };
    
    const handlePause = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    };
    
    if (isPlaying) {
      handlePlay();
    } else {
      handlePause();
    }
  }, [isPlaying]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  // Add scroll listener to detect when page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };
    
    // Check initial scroll position
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Auto-collapse timer
  useEffect(() => {
    // Clear any existing timer when component state changes
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
    
    // Only set collapse timer if expanded
    if (isExpanded) {
      collapseTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 5000); // Collapse after 5 seconds of inactivity
    }
    
    return () => {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
      }
    };
  }, [isExpanded, isPlaying, volume, isMuted]);

  // Initialize audio on first interaction
  const initializeAudio = () => {
    if (!audioRef.current) return;
    setUserInteracted(true);
    audioRef.current.load();
  };
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Reset collapse timer on any interaction
  const resetCollapseTimer = () => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
    }
    
    if (isExpanded) {
      collapseTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
    }
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    if (!userInteracted) {
      initializeAudio();
    }
    setIsPlaying(!isPlaying);
    resetCollapseTimer();
  };

  // Toggle mute
  const toggleMute = () => {
    if (!userInteracted) {
      initializeAudio();
    }
    setIsMuted(!isMuted);
    resetCollapseTimer();
  };
  
  // Increase volume
  const increaseVolume = () => {
    const newVolume = Math.min(1, volume + 0.1);
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
    resetCollapseTimer();
  };
  
  // Decrease volume
  const decreaseVolume = () => {
    const newVolume = Math.max(0, volume - 0.1);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    resetCollapseTimer();
  };

  // Get position classes based on the position prop
  const getPositionClasses = (position: Position): string => {
    switch (position) {
      case 'top-left':
        return 'top-20 md:top-4 left-4';
      case 'top-right':
        return 'top-20 md:top-4 right-4';
      case 'bottom-left':
        return 'bottom-20 md:bottom-4 left-4';
      case 'bottom-right':
      default:
        return 'bottom-20 md:bottom-4 right-4';
    }
  };

  return (
    <div 
      className={`fixed ${getPositionClasses(position)} z-50 
        ${isScrolled ? 'bg-black/95 border-red-500' : 'bg-black/80 border-red-600'} 
        hover:bg-black/95 hover:border-red-400 backdrop-blur-sm rounded-lg shadow-2xl 
        ${isExpanded ? 'p-4' : 'p-2'} 
        border-2 transition-all duration-500 ease-in-out transform
        ${!isPlaying ? 'animate-pulse shadow-red-500/50' : 'shadow-red-600/30'} 
        hover:scale-105 hover:shadow-red-500/50
        flex flex-col items-start gap-2 overflow-hidden
        ${isExpanded ? 'w-auto min-w-[240px]' : 'w-12 h-12'}
        ${isPlaying ? 'shadow-lg shadow-red-500/40 border-red-500' : ''}`}
      onClick={() => {
        if (!isExpanded) {
          toggleExpanded();
        }
        resetCollapseTimer();
      }}
      aria-label="Music player"
      role="button"
    >
      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
      >
        <source src={audioSrc} type={audioType} />
        Your browser does not support the audio element.
      </audio>
      
      {/* Top row: Icon + Controls */}
      <div className={`flex items-center ${isExpanded ? 'gap-3 w-full' : 'w-full h-full justify-center'}`}>
        {/* Bubble icon - always visible */}
        <div className={`flex items-center justify-center ${isExpanded ? '' : 'w-full h-full'}`}>
          <span 
            className={`${isExpanded ? 'text-lg' : 'text-xl'} ${!isExpanded && isPlaying ? 'animate-bounce' : ''} 
              filter drop-shadow-lg ${isPlaying ? 'animate-pulse' : ''}`}
          >
            🤘
          </span>
        </div>

        {/* Expanded controls - with smooth transition */}
        <div className={`flex items-center gap-2 ${isExpanded ? 'opacity-100 flex-1' : 'opacity-0 w-0'} transition-all duration-500 ease-in-out overflow-hidden`}>
        <>
          {/* Play/Pause button */}
          <Button 
            variant="ghost" 
            isIconOnly
            size="sm"
            onPress={() => {
              togglePlay();
            }}
            disabled={audioError}
            className="text-red-400 hover:text-red-200 hover:bg-red-900/50 border border-red-500/30 hover:border-red-400 ml-1 hover:scale-105 transition-all min-w-8 h-8 p-1"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          {/* Volume control */}
          <Button 
            variant="ghost" 
            isIconOnly 
            size="sm"
            onPress={() => {
              toggleMute();
            }}
            disabled={audioError}
            className="text-red-400 hover:text-red-200 hover:bg-red-900/50 border border-red-500/30 hover:border-red-400 hover:scale-105 transition-all min-w-8 h-8 p-1"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          
          {/* Volume buttons */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              isIconOnly
              size="sm"
              onPress={() => {
                decreaseVolume();
              }}
              disabled={volume <= 0}
              className="text-red-400 hover:text-red-200 hover:bg-red-900/50 border border-red-500/30 hover:border-red-400 min-w-6 h-6 hover:scale-105 transition-all p-0.5"
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="text-xs font-bold text-red-300 w-8 text-center tracking-wider">
              {Math.round(volume * 100)}%
            </span>
            
            <Button 
              variant="ghost" 
              isIconOnly
              size="sm"
              onPress={() => {
                increaseVolume();
              }}
              disabled={volume >= 1}
              className="text-red-400 hover:text-red-200 hover:bg-red-900/50 border border-red-500/30 hover:border-red-400 min-w-6 h-6 hover:scale-105 transition-all p-0.5"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </>
        </div>
      </div>
      
      {/* Song name - below controls with dope styling */}
      {isExpanded && songName && (
        <div className="flex flex-col items-center w-full mt-2 border-t border-red-500/30 pt-2">
          <div className="text-center">
            <div className="text-xs text-red-400 font-bold tracking-widest mb-1">
              {isPlaying ? "♪ NOW PLAYING ♪" : "♪ LFG!!! ♪"}
            </div>
            <div className="text-sm font-black uppercase tracking-wider transform -skew-x-12 
              drop-shadow-lg shadow-red-500/50 
              bg-gradient-to-r from-red-600 via-red-400 to-red-600 bg-clip-text
              hover:scale-105 transition-all cursor-default
              font-mono text-white">
              {songName}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
