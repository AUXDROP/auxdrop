// Client-only audio analysis for the submission upload flow — extracts
// duration and waveform peaks in the browser via the Web Audio API rather
// than a server-side audio-processing dependency.

export interface AudioAnalysis {
  durationSec: number;
  peaks: number[];
}

export async function analyzeAudioFile(file: File, bars = 40): Promise<AudioAnalysis> {
  const arrayBuffer = await file.arrayBuffer();
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  const ctx = new AudioCtx();

  try {
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    const channelData = audioBuffer.getChannelData(0);
    const samplesPerBar = Math.max(1, Math.floor(channelData.length / bars));

    const peaks: number[] = [];
    for (let i = 0; i < bars; i++) {
      const start = i * samplesPerBar;
      const end = Math.min(start + samplesPerBar, channelData.length);
      let sum = 0;
      for (let j = start; j < end; j++) sum += Math.abs(channelData[j]);
      const avgAmplitude = end > start ? sum / (end - start) : 0;
      // Average amplitude in real music is well under 1.0 — scale up so
      // quiet-to-loud passages spread visibly across the 8-100 range.
      peaks.push(Math.min(100, Math.max(8, Math.round(avgAmplitude * 400))));
    }

    return { durationSec: Math.round(audioBuffer.duration), peaks };
  } finally {
    await ctx.close();
  }
}
