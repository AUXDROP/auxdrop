"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import { Button, Input } from "@/components/ui";
import { Waveform } from "@/components/audio/Waveform";
import { analyzeAudioFile, type AudioAnalysis } from "@/lib/audio-client";
import { submitTrack, type SubmitState } from "./actions";

export function SubmissionForm({ battleId }: { battleId: string }) {
  const boundAction = submitTrack.bind(null, battleId);
  const [state, formAction, pending] = useActionState<SubmitState, FormData>(
    boundAction,
    {},
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AudioAnalysis | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileError("");
    setAnalyzing(true);
    try {
      setAnalysis(await analyzeAudioFile(file));
    } catch {
      setAnalysis(null);
      setFileError("Couldn't read that audio file — try a different one.");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Input name="title" placeholder="Track title" required />

      <input
        type="file"
        name="audio"
        accept="audio/*"
        required
        onChange={handleFileChange}
        className="font-sans text-xs text-muted file:mr-3 file:cursor-pointer file:rounded-button file:border-0 file:bg-elevated file:px-4 file:py-2.5 file:font-sans file:text-xs file:font-bold file:text-on-dark"
      />

      {analyzing && (
        <p className="font-sans text-xs text-faint">Analyzing audio…</p>
      )}
      {fileError && (
        <p className="font-sans text-xs text-status-error">{fileError}</p>
      )}
      {analysis && (
        <div className="rounded-card border border-border bg-elevated p-4">
          <Waveform peaks={analysis.peaks} />
          <div className="mt-2 font-sans text-xs text-faint">
            {fileName} · {Math.floor(analysis.durationSec / 60)}:
            {String(analysis.durationSec % 60).padStart(2, "0")}
          </div>
        </div>
      )}

      <input type="hidden" name="durationSec" value={analysis?.durationSec ?? 0} />
      <input
        type="hidden"
        name="peaks"
        value={JSON.stringify(analysis?.peaks ?? [])}
      />

      {state?.error && (
        <p className="font-sans text-[13px] text-status-error">{state.error}</p>
      )}

      <Button
        type="submit"
        disabled={pending || analyzing || !analysis}
        className="w-full"
      >
        {pending ? "Submitting..." : "Submit your beat"}
      </Button>
    </form>
  );
}
