"use client";

import { useState, useEffect, useRef } from "react";

interface Note {
  id: string;
  text: string;
  author: string;
  date: string;
  revealAge: number | null; // null means 'Anytime'
  createdAt?: number;
}

const BIRTH_YEAR = 2025;

// Gentle pastel palettes for the sticky notes — picked deterministically per note
// so a note always keeps the same color and tilt.
const PALETTES = [
  { bg: "#FFF3E9", tape: "#F9C5BC", line: "#F3D9C9" }, // peach
  { bg: "#F1ECFB", tape: "#C5B3E0", line: "#DDD0F0" }, // lavender
  { bg: "#E9F3FC", tape: "#9FC8EE", line: "#C5DFF5" }, // sky
  { bg: "#E9F7EF", tape: "#A6DEC0", line: "#C8EDD8" }, // mint
  { bg: "#FFFAF7", tape: "#F4B6A6", line: "#F0E0D0" }, // cream
];

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

function NoteCard({ note, currentAge, index }: { note: Note; currentAge: number; index: number }) {
  const isLocked = note.revealAge !== null && currentAge < note.revealAge;
  const palette = PALETTES[hashId(note.id) % PALETTES.length];
  const tilt = ((hashId(note.id) % 5) - 2) * 0.9; // -1.8deg .. +1.8deg

  return (
    <div
      className="sticky-note pop-in"
      style={{
        background: palette.bg,
        ["--note-line" as string]: palette.line,
        transform: `rotate(${tilt}deg)`,
        animationDelay: `${Math.min(index, 8) * 0.05}s`,
      }}
    >
      {/* washi tape */}
      <span className="washi-tape" style={{ background: palette.tape }} aria-hidden />

      {isLocked && (
        <div className="note-lock-badge">
          <span className="badge" style={{ background: "var(--lavender)", color: "var(--text)", borderColor: "var(--lavender-mid)" }}>
            🔒 Opens at {note.revealAge}
          </span>
        </div>
      )}

      <div
        style={{
          filter: isLocked ? "blur(7px)" : "none",
          userSelect: isLocked ? "none" : "auto",
          transition: "filter 0.3s ease",
        }}
      >
        <p className="note-text">
          {isLocked ? "A secret note, waiting for just the right birthday to be read. Shh — no peeking! 🤫" : note.text}
        </p>
      </div>

      <div className="note-meta">
        <span className="note-author">♡ {note.author}</span>
        <span className="note-date">{note.date}</span>
      </div>

      {isLocked && (
        <div className="note-lock-overlay">
          <div className="note-lock-pill">No peeking until {note.revealAge}! 👀</div>
        </div>
      )}
    </div>
  );
}

// Little hearts that float up when a note is saved.
function HeartBurst({ id }: { id: number }) {
  const hearts = Array.from({ length: 9 }, (_, i) => i);
  return (
    <div className="heart-burst" key={id} aria-hidden>
      {hearts.map((i) => (
        <span
          key={i}
          className="burst-heart"
          style={{
            left: `${10 + Math.random() * 80}%`,
            animationDelay: `${Math.random() * 0.3}s`,
            fontSize: `${14 + Math.random() * 16}px`,
          }}
        >
          {["💗", "💕", "🩷", "✨", "💖"][i % 5]}
        </span>
      ))}
    </div>
  );
}

export default function MemoryNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [revealAge, setRevealAge] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [burst, setBurst] = useState<number | null>(null);
  const migrated = useRef(false);

  const currentAge = new Date().getFullYear() - BIRTH_YEAR;

  async function loadNotes() {
    try {
      const res = await fetch("/api/notes", { cache: "no-store" });
      const data = await res.json();
      setNotes(data.notes ?? []);
      return (data.notes ?? []) as Note[];
    } catch {
      setError("Couldn't load notes. Check your connection.");
      return [];
    } finally {
      setLoading(false);
    }
  }

  // One-time migration: rescue any notes saved in this browser's old localStorage
  // into the shared database so they aren't lost.
  async function migrateLocalNotes() {
    if (migrated.current) return;
    migrated.current = true;
    try {
      if (localStorage.getItem("daphne-notes-migrated")) return;
      const saved = localStorage.getItem("daphne-notes-v2");
      if (!saved) {
        localStorage.setItem("daphne-notes-migrated", "true");
        return;
      }
      const old = JSON.parse(saved) as Note[];
      for (const n of old.reverse()) {
        await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: n.text, author: n.author, date: n.date, revealAge: n.revealAge }),
        });
      }
      localStorage.setItem("daphne-notes-migrated", "true");
      await loadNotes();
    } catch {
      /* best-effort */
    }
  }

  useEffect(() => {
    setCustomDate(new Date().toISOString().split("T")[0]);
    loadNotes().then((fetched) => {
      if (fetched.length === 0) migrateLocalNotes();
      else localStorage.setItem("daphne-notes-migrated", "true");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    setError("");

    let displayDate = customDate;
    const d = new Date(customDate);
    if (!isNaN(d.getTime())) {
      displayDate = d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    }

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          author: author.trim(),
          date: displayDate,
          revealAge: revealAge === 0 ? null : revealAge,
        }),
      });
      if (!res.ok) throw new Error("save failed");
      const { note } = await res.json();
      setNotes((prev) => [note, ...prev]);
      setText("");
      setAuthor("");
      setRevealAge(0);
      setBurst(Date.now());
      setTimeout(() => setBurst(null), 1600);
    } catch {
      setError("Hmm, that note didn't save. Try again?");
    } finally {
      setSubmitting(false);
    }
  }

  function exportNotes() {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daphne-notes-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Opens a print-ready booklet of every note ("Save as PDF" in the print
  // dialog turns it into a file). Sealed notes are listed without their text
  // so the printed book doesn't spoil them.
  function printKeepsakeBook() {
    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const open = notes.filter((n) => n.revealAge === null || currentAge >= n.revealAge);
    const sealed = notes.filter((n) => n.revealAge !== null && currentAge < n.revealAge);
    const year = new Date().getFullYear();

    const noteCards = open
      .map(
        (n) => `
        <div class="bk-note">
          <p class="bk-text">${esc(n.text)}</p>
          <div class="bk-meta"><span>♡ ${esc(n.author)}</span><span>${esc(n.date)}</span></div>
        </div>`
      )
      .join("");

    const sealedList = sealed.length
      ? `
      <div class="bk-sealed">
        <h2>Still sealed 🔒</h2>
        <p class="bk-sealed-sub">These notes are waiting for future birthdays — no spoilers in print!</p>
        ${sealed
          .map(
            (n) =>
              `<p class="bk-sealed-row">♡ A note from <strong>${esc(n.author)}</strong>, sealed until age ${n.revealAge} (${esc(n.date)})</p>`
          )
          .join("")}
      </div>`
      : "";

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Letters to Daphne</title>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Quicksand', sans-serif; color: #3D2C2C; background: white; }
  .bk-cover { height: 95vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; page-break-after: always; }
  .bk-heart { font-size: 64px; color: #F4846A; margin-bottom: 24px; }
  .bk-cover h1 { font-family: 'Fredoka', sans-serif; font-size: 44px; margin-bottom: 12px; }
  .bk-cover p { color: #7A5C5C; font-size: 16px; }
  .bk-notes { padding: 24px 8%; }
  .bk-note { border: 2px solid #F0C4B8; border-radius: 16px; padding: 22px 26px; margin-bottom: 22px; page-break-inside: avoid; background: #FFFAF7; }
  .bk-text { font-size: 15px; line-height: 1.6; margin-bottom: 14px; white-space: pre-wrap; }
  .bk-meta { display: flex; justify-content: space-between; border-top: 1.5px dashed #F0C4B8; padding-top: 10px; font-size: 12px; }
  .bk-meta span:first-child { font-family: 'Fredoka', sans-serif; color: #E06D54; }
  .bk-meta span:last-child { color: #B08080; }
  .bk-sealed { padding: 24px 8% 48px; page-break-before: always; }
  .bk-sealed h2 { font-family: 'Fredoka', sans-serif; margin-bottom: 6px; }
  .bk-sealed-sub { color: #7A5C5C; font-size: 13px; margin-bottom: 18px; }
  .bk-sealed-row { font-size: 14px; padding: 8px 0; border-bottom: 1.5px dashed #F0C4B8; }
  @page { margin: 18mm 12mm; }
</style></head>
<body>
  <div class="bk-cover">
    <div class="bk-heart">♥</div>
    <h1>Letters to Daphne</h1>
    <p>A little book of love · started June 12, 2026</p>
    <p style="margin-top:8px">${open.length + sealed.length} notes and counting · printed ${year}</p>
  </div>
  <div class="bk-notes">${noteCards}</div>
  ${sealedList}
  <script>window.onload = () => setTimeout(() => window.print(), 600);</script>
</body></html>`;

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
  }

  return (
    <section style={{ padding: "80px 20px", background: "var(--peach-mid)", position: "relative", overflow: "hidden" }}>
      {burst !== null && <HeartBurst id={burst} />}

      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div className="section-label">A Little Forever Scrapbook</div>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "clamp(1.8rem, 5vw, 2.6rem)", fontWeight: 700, color: "var(--text)" }}>
            Notes for Daphne 💌
          </h2>
          <p style={{ fontFamily: "'Quicksand', sans-serif", color: "var(--text-soft)", fontSize: "0.95rem", marginTop: 6, maxWidth: 460, marginInline: "auto" }}>
            Leave a little message she can read as she grows. You can even lock one to open at a future birthday.
          </p>
        </div>

        {/* Add note area */}
        <div className="no-print" style={{ marginBottom: 44 }}>
          <form onSubmit={addNote} className="note-form">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Dear Daphne…"
              rows={3}
              maxLength={2000}
              className="note-input note-textarea"
            />

            <div className="note-form-row">
              <div>
                <label className="note-label">From</label>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Your name"
                  maxLength={80}
                  className="note-input"
                />
              </div>
              <div>
                <label className="note-label">Date</label>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="note-input"
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                <label className="note-label" style={{ marginBottom: 0 }}>
                  Reveal at age
                </label>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: "var(--coral)" }}>
                  {revealAge === 0 ? "Anytime 💛" : `🔒 Age ${revealAge}`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="21"
                value={revealAge}
                onChange={(e) => setRevealAge(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "var(--coral)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "'Quicksand', sans-serif" }}>
                <span>Anytime</span>
                <span>21st 🎉</span>
              </div>
            </div>

            {error && (
              <p style={{ color: "var(--coral-dark)", fontSize: "0.85rem", marginBottom: 12, fontFamily: "'Quicksand', sans-serif" }}>{error}</p>
            )}

            <button type="submit" className="btn-primary" disabled={submitting} style={{ width: "100%", justifyContent: "center", opacity: submitting ? 0.7 : 1 }}>
              {submitting ? "Saving…" : "Add to the scrapbook ♡"}
            </button>
          </form>
        </div>

        {/* Count + export */}
        {!loading && notes.length > 0 && (
          <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontFamily: "'Fredoka', sans-serif", color: "var(--text-soft)", fontWeight: 500 }}>
              {notes.length} {notes.length === 1 ? "note" : "notes"} and counting ✨
            </span>
            <span style={{ display: "inline-flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={printKeepsakeBook} className="link-btn" title="Print every note as a keepsake booklet (or save as PDF)">
                📖 Print keepsake book
              </button>
              <button onClick={exportNotes} className="link-btn" title="Download a backup of every note">
                ⬇ Save a backup
              </button>
            </span>
          </div>
        )}

        {/* Notes board */}
        {loading ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontFamily: "'Quicksand', sans-serif" }}>Gathering the notes… 💭</p>
        ) : notes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 16px" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🌱</div>
            <p style={{ color: "var(--text-soft)", fontFamily: "'Quicksand', sans-serif", fontSize: "1.05rem" }}>
              No notes yet — be the very first to write to her.
            </p>
          </div>
        ) : (
          <div className="notes-board">
            {notes.map((note, i) => (
              <NoteCard key={note.id} note={note} currentAge={currentAge} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
