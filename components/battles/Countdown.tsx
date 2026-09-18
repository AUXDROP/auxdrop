"use client";

import { useEffect, useState } from "react";

function format(msRemaining: number): string {
  if (msRemaining <= 0) return "00:00:00";
  const totalSeconds = Math.floor(msRemaining / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function Countdown({ target }: { target: string }) {
  const targetMs = new Date(target).getTime();
  const [display, setDisplay] = useState(() => format(targetMs - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplay(format(targetMs - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetMs]);

  return <>{display}</>;
}
