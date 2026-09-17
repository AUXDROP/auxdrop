"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Waveform } from "./Waveform";

export interface AudioPlayerBarProps {
  src: string;
  /** Bar heights as 0–100 percentages, from the track's precomputed waveform data. */
  peaks?: number[];
  title?: string;
  className?: string;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayerBar({ src, peaks, title, className }: AudioPlayerBarProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // The <audio src> starts loading as soon as the SSR'd HTML is parsed,
    // which can be before hydration attaches onLoadedMetadata below — so
    // metadata may already be available by the time this effect runs.
    const audio = audioRef.current;
    if (audio && audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
      setDuration(audio.duration);
    }
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const seek = (ratio: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = ratio * duration;
  };

  return (
    <div
      data-component="audio-player-bar"
      className={cn(
        "flex items-center gap-4 rounded-card border border-border bg-elevated px-5 py-4",
        className,
      )}
    >
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={() => setIsPlaying(false)}
      />
      <button
        type="button"
        data-action="toggle-play"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        aria-pressed={isPlaying}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-signal font-sans text-on-dark"
      >
        {isPlaying ? (
          <span className="text-xs" aria-hidden>
            ❚❚
          </span>
        ) : (
          <span className="ml-0.5 text-xs" aria-hidden>
            ▶
          </span>
        )}
      </button>
      <Waveform
        peaks={peaks}
        progress={duration ? currentTime / duration : 0}
        onSeek={seek}
      />
      <span
        data-field="track-time"
        className="flex-shrink-0 font-sans text-xs text-faint"
      >
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
      {title && <span className="sr-only">{title}</span>}
    </div>
  );
}
