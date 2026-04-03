"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, Download, Volume2 } from "lucide-react";
import type { Character } from "./character-builder";

interface AnimatedAudioPlayerProps {
  audioSrc: string;
  characters: Character[];
  onDownload: () => void;
  downloadLabel: string;
  audioTitle: string;
}

// Character color palette — cycles through these
const CHARACTER_COLORS = [
  { bg: "bg-italianto-100 dark:bg-italianto-900/40", text: "text-italianto-800 dark:text-italianto-300", dot: "bg-italianto-500" },
  { bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-800 dark:text-purple-300", dot: "bg-purple-500" },
  { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-800 dark:text-amber-300", dot: "bg-amber-500" },
  { bg: "bg-pink-100 dark:bg-pink-900/40", text: "text-pink-800 dark:text-pink-300", dot: "bg-pink-500" },
];

function formatTime(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// Bar heights in percent (0–100) — 12 bars, varied heights for organic look
const BAR_BASE_HEIGHTS = [35, 60, 80, 50, 90, 40, 70, 55, 85, 45, 65, 75];
const BAR_ANIMATION_DELAYS = ["0ms", "80ms", "160ms", "40ms", "200ms", "120ms", "60ms", "180ms", "100ms", "220ms", "140ms", "20ms"];

export default function AnimatedAudioPlayer({
  audioSrc,
  characters,
  onDownload,
  downloadLabel,
  audioTitle,
}: AnimatedAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeCharIdx, setActiveCharIdx] = useState(0);

  // Cycle through characters while playing (visual effect)
  useEffect(() => {
    if (!isPlaying || characters.length <= 1) return;
    const interval = setInterval(() => {
      setActiveCharIdx((prev) => (prev + 1) % characters.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlaying, characters.length]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
    setActiveCharIdx(0);
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    audio.currentTime = ratio * audio.duration;
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-2xl border border-italianto-100 dark:border-slate-600 bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-2">
        <Volume2 size={16} className="text-italianto-600 dark:text-italianto-400 shrink-0" />
        <span className="text-sm font-semibold text-italianto-800 dark:text-italianto-300 truncate">{audioTitle}</span>
      </div>

      {/* Equalizer visualizer */}
      <div className="px-5 pb-4 flex items-end gap-[3px] h-14">
        {BAR_BASE_HEIGHTS.map((baseH, i) => (
          <div
            key={i}
            className="flex-1 rounded-full transition-all"
            style={{
              height: isPlaying ? `${baseH}%` : "20%",
              backgroundColor: i % 2 === 0
                ? "rgb(46 125 50 / 0.7)"
                : "rgb(46 125 50 / 0.4)",
              animationDelay: BAR_ANIMATION_DELAYS[i],
              animation: isPlaying
                ? `equalizerPulse 0.8s ease-in-out ${BAR_ANIMATION_DELAYS[i]} infinite alternate`
                : "none",
              transition: "height 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-2">
        <div
          ref={progressRef}
          onClick={handleSeek}
          className="relative h-1.5 bg-italianto-100 dark:bg-slate-600 rounded-full cursor-pointer group"
        >
          <div
            className="absolute left-0 top-0 h-full bg-italianto-600 dark:bg-italianto-400 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-italianto-700 dark:bg-italianto-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[11px] text-gray-400 dark:text-slate-500 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-5 pb-4 flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-italianto-800 dark:bg-italianto-700 text-white hover:bg-italianto-900 dark:hover:bg-italianto-600 active:scale-95 transition-all shadow"
          aria-label={isPlaying ? "Pausar" : "Reproducir"}
        >
          {isPlaying
            ? <Pause size={20} fill="white" />
            : <Play size={20} fill="white" className="translate-x-0.5" />
          }
        </button>

        {/* Character indicators */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {characters.filter(c => c.name).map((char, i) => {
            const colors = CHARACTER_COLORS[i % CHARACTER_COLORS.length];
            const isActive = isPlaying && activeCharIdx === i;
            return (
              <div
                key={char.id}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-500 truncate max-w-[120px] ${colors.bg} ${colors.text} ${isActive ? "ring-2 ring-offset-1 ring-italianto-400 dark:ring-italianto-500 scale-105" : "opacity-70"}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot} ${isActive ? "animate-pulse" : ""}`} />
                <span className="truncate">{char.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Download button */}
      <div className="px-5 pb-5">
        <button
          onClick={onDownload}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-italianto-800 text-white text-sm font-semibold rounded-xl hover:bg-italianto-900 transition-colors"
        >
          <Download size={16} />
          {downloadLabel}
        </button>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Equalizer keyframes injected via style tag */}
      <style>{`
        @keyframes equalizerPulse {
          0%   { transform: scaleY(0.5); }
          100% { transform: scaleY(1.3); }
        }
      `}</style>
    </div>
  );
}
