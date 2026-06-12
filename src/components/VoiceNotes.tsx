"use client";

import { useState, useRef, useEffect } from "react";

interface VoiceNoteMeta {
  id: string;
  author: string;
  date: string;
  mime: string;
}

const MAX_SECONDS = 90;

function pickMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  for (const t of ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"]) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return "";
}

export default function VoiceNotes() {
  const [notes, setNotes] = useState<VoiceNoteMeta[]>([]);
  const [phase, setPhase] = useState<"idle" | "recording" | "preview" | "saving">("idle");
  const [author, setAuthor] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");
  const [supported, setSupported] = useState(true);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/voice", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setNotes(d.notes ?? []))
      .catch(() => {});
    setSupported(
      typeof navigator !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia &&
      typeof MediaRecorder !== "undefined"
    );
    return () => stopTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }

  async function startRecording() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = pickMimeType();
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        blobRef.current = blob;
        setPreviewUrl(URL.createObjectURL(blob));
        setPhase("preview");
      };
      recorderRef.current = rec;
      rec.start();
      setPhase("recording");
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed((s) => {
          if (s + 1 >= MAX_SECONDS) stopRecording();
          return s + 1;
        });
      }, 1000);
    } catch {
      setError("Couldn't access the microphone — check your browser permissions.");
    }
  }

  function stopRecording() {
    stopTimer();
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }

  function discard() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    blobRef.current = null;
    setPhase("idle");
    setElapsed(0);
  }

  async function save() {
    if (!blobRef.current) return;
    setPhase("saving");
    setError("");
    try {
      const form = new FormData();
      const ext = blobRef.current.type.includes("mp4") ? "m4a" : "webm";
      form.append("audio", blobRef.current, `voice-note.${ext}`);
      form.append("author", author.trim());
      const res = await fetch("/api/voice", { method: "POST", body: form });
      if (!res.ok) throw new Error("upload failed");
      const { note } = await res.json();
      setNotes((prev) => [note, ...prev]);
      setAuthor("");
      discard();
    } catch {
      setError("That didn't upload. Try again?");
      setPhase("preview");
    }
  }

  const mins = Math.floor(elapsed / 60);
  const secs = (elapsed % 60).toString().padStart(2, "0");

  return (
    <section style={{ padding: "80px 20px", background: "var(--peach)" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div className="section-label">In Your Own Voice</div>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "clamp(1.8rem, 5vw, 2.6rem)", fontWeight: 700, color: "var(--text)" }}>
            Voice Notes 🎤
          </h2>
          <p style={{ fontFamily: "'Quicksand', sans-serif", color: "var(--text-soft)", fontSize: "0.95rem", marginTop: 6, maxWidth: 440, marginInline: "auto" }}>
            Record a little message so one day she can hear exactly how you sounded when she was small.
          </p>
        </div>

        {/* Recorder */}
        <div className="voice-card no-print" style={{ textAlign: "center", padding: 28, marginBottom: 36 }}>
          {!supported ? (
            <p style={{ fontFamily: "'Quicksand', sans-serif", color: "var(--text-muted)" }}>
              This browser can&apos;t record audio — try Chrome or Safari on your phone.
            </p>
          ) : phase === "idle" ? (
            <>
              <button onClick={startRecording} className="record-btn" aria-label="Start recording">
                🎙
              </button>
              <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 14 }}>
                Tap to record · up to {MAX_SECONDS / 60 === 1.5 ? "90 seconds" : `${MAX_SECONDS}s`}
              </p>
            </>
          ) : phase === "recording" ? (
            <>
              <button onClick={stopRecording} className="record-btn record-btn-recording" aria-label="Stop recording">
                ◼
              </button>
              <p style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "1.2rem", color: "var(--coral-dark)", marginTop: 14 }}>
                {mins}:{secs}
              </p>
              <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Recording… tap to stop
              </p>
            </>
          ) : (
            <>
              {previewUrl && <audio controls src={previewUrl} className="voice-audio" style={{ marginBottom: 16 }} />}
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name"
                maxLength={80}
                className="note-input"
                style={{ marginBottom: 14, textAlign: "center" }}
              />
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={save} className="btn-primary" disabled={phase === "saving"} style={{ opacity: phase === "saving" ? 0.7 : 1 }}>
                  {phase === "saving" ? "Saving…" : "Save it ♡"}
                </button>
                <button onClick={discard} className="btn-outline" disabled={phase === "saving"}>
                  Re-record
                </button>
              </div>
            </>
          )}
          {error && (
            <p style={{ color: "var(--coral-dark)", fontSize: "0.85rem", marginTop: 12, fontFamily: "'Quicksand', sans-serif" }}>{error}</p>
          )}
        </div>

        {/* Saved voice notes */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {notes.map((n) => (
            <div key={n.id} className="voice-card pop-in">
              <audio controls preload="none" src={`/api/voice/${n.id}`} className="voice-audio" />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "0.9rem", fontWeight: 500, color: "var(--coral-dark)" }}>
                  ♡ {n.author}
                </span>
                <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  {n.date}
                </span>
              </div>
            </div>
          ))}
          {notes.length === 0 && (
            <p style={{ textAlign: "center", color: "var(--text-muted)", fontFamily: "'Quicksand', sans-serif", fontSize: "0.9rem" }}>
              No voice notes yet — yours could be the first she ever hears. 🤍
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
