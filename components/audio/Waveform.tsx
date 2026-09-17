"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export interface WaveformProps {
  /** Bar heights as 0–100 percentages. Falls back to a placeholder shape when omitted. */
  peaks?: number[];
  /** Fraction of the track played, 0–1. */
  progress?: number;
  size?: "default" | "mini";
  onSeek?: (ratio: number) => void;
  className?: string;
}

function placeholderPeaks(count: number): number[] {
  return Array.from({ length: count }, (_, i) => 20 + Math.abs(Math.sin(i * 0.7)) * 70);
}

export function Waveform({
  peaks,
  progress = 0,
  size = "default",
  onSeek,
  className,
}: WaveformProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const bars = peaks ?? placeholderPeaks(size === "mini" ? 24 : 40);
  const playedCount = Math.round(progress * bars.length);

  return (
    <div
      data-component={size === "mini" ? "waveform-mini" : "waveform"}
      className={cn(
        "flex flex-1 items-center gap-0.5",
        size === "mini" ? "h-5" : "h-8",
        onSeek && "cursor-pointer",
        className,
      )}
      onMouseLeave={() => setHoverIndex(null)}
    >
      {bars.map((height, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 rounded-sm transition-colors",
            hoverIndex === i
              ? "bg-accent"
              : i < playedCount
                ? "bg-signal"
                : "bg-border",
          )}
          style={{ height: `${height}%` }}
          onMouseEnter={() => onSeek && setHoverIndex(i)}
          onClick={() => onSeek?.((i + 1) / bars.length)}
        />
      ))}
    </div>
  );
}
