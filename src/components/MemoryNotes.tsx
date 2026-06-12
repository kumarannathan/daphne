"use client";

import { useState, useEffect } from "react";

interface Note {
  id: string;
  text: string;
  author: string;
  date: string;
  revealAge: number | null; // null means 'Anytime'
}

const BIRTH_YEAR = 2025;

function NoteCard({ note, currentAge }: { note: Note; currentAge: number }) {
  const isLocked = note.revealAge !== null && currentAge < note.revealAge;

  return (
    <div className="note-card pop-in" style={{ padding: "20px 24px", position: "relative" }}>
      {isLocked && (
        <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
          <span className="badge" style={{ background: "var(--lavender)", color: "var(--text)", borderColor: "var(--lavender-mid)" }}>
            🔒 Opens at Age {note.revealAge}
          </span>
        </div>
      )}

      <div style={{
        filter: isLocked ? "blur(6px)" : "none",
        userSelect: isLocked ? "none" : "auto",
        transition: "filter 0.3s ease"
      }}>
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: "1.1rem",
          color: "var(--text)",
          lineHeight: 1.5,
          marginBottom: 16,
        }}>
          {isLocked ? "This is a secret note waiting for the right time to be read. Shh! Don't peek!" : note.text}
        </p>
      </div>

      <hr className="dot-divider" style={{ marginBottom: 12, borderColor: "var(--border)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "0.9rem", fontWeight: 500, color: "var(--coral)" }}>
          From: {note.author}
        </span>
        <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          {note.date}
        </span>
      </div>

      {isLocked && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 }}>
          <div style={{ background: "rgba(255,255,255,0.8)", padding: "8px 16px", borderRadius: 100, border: "2px solid var(--lavender-mid)", fontFamily: "'Fredoka', sans-serif", fontSize: "0.9rem", color: "var(--text-muted)" }}>
            No peeking until {note.revealAge}! 👀
          </div>
        </div>
      )}
    </div>
  );
}

export default function MemoryNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [revealAge, setRevealAge] = useState<number>(0);

  const currentAge = new Date().getFullYear() - BIRTH_YEAR;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("daphne-notes-v2");
      if (saved) {
        setNotes(JSON.parse(saved) as Note[]);
      }
    } catch {}
    // Set default date to today
    setCustomDate(new Date().toISOString().split("T")[0]);
  }, []);

  function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    // Format the date nicely if it's a valid date
    let displayDate = customDate;
    try {
      const d = new Date(customDate);
      if (!isNaN(d.getTime())) {
        displayDate = d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
      }
    } catch {}

    const newNote: Note = {
      id: Date.now().toString(),
      text: text.trim(),
      author: author.trim() || "Anonymous",
      date: displayDate,
      revealAge: revealAge === 0 ? null : revealAge,
    };

    const updated = [newNote, ...notes];
    try {
      localStorage.setItem("daphne-notes-v2", JSON.stringify(updated));
    } catch {}
    setNotes(updated);
    setText("");
    setAuthor("");
    setRevealAge(0);
  }

  return (
    <section style={{ padding: "80px 24px", background: "var(--peach-mid)" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "2rem", fontWeight: 700, color: "var(--text)" }}>
            Notes
          </h2>
        </div>

        {/* Add note area */}
        <div className="no-print" style={{ marginBottom: 40 }}>
          <form onSubmit={addNote} className="card" style={{ padding: 24, background: "white" }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a note..."
              rows={3}
              style={{
                width: "100%", padding: 12, borderRadius: 12, border: "2px solid var(--border)",
                fontFamily: "'Nunito', sans-serif", fontSize: "1rem", resize: "none", outline: "none", marginBottom: 12,
              }}
            />
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 4, fontFamily: "'Nunito', sans-serif", fontWeight: 700, textTransform: "uppercase" }}>From</label>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Your name"
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: 12, border: "2px solid var(--border)",
                    fontFamily: "'Nunito', sans-serif", fontSize: "0.95rem", outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 4, fontFamily: "'Nunito', sans-serif", fontWeight: 700, textTransform: "uppercase" }}>Date</label>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  style={{
                    width: "100%", padding: "9px 12px", borderRadius: 12, border: "2px solid var(--border)",
                    fontFamily: "'Nunito', sans-serif", fontSize: "0.95rem", outline: "none", background: "white"
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "'Nunito', sans-serif", fontWeight: 700, textTransform: "uppercase" }}>
                  Reveal At Age
                </label>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: "var(--coral)" }}>
                  {revealAge === 0 ? "Anytime (Unlocked)" : `Age ${revealAge}`}
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
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "'Nunito', sans-serif" }}>
                <span>Anytime</span>
                <span>21</span>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Save Note
            </button>
          </form>
        </div>

        {/* Notes list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} currentAge={currentAge} />
          ))}
          {notes.length === 0 && (
            <p style={{ textAlign: "center", color: "var(--text-muted)", fontFamily: "'Nunito', sans-serif" }}>
              No notes yet. Be the first!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
