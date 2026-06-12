import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";

// Notes are written by visitors and must never be cached.
export const dynamic = "force-dynamic";

export interface Note {
  id: string;
  text: string;
  author: string;
  date: string; // human-friendly display date chosen by the writer
  revealAge: number | null; // null = visible anytime
  createdAt: number; // server timestamp, used for ordering
}

const STORE_NAME = "daphne-notes";
// Local-dev fallback: when not running on Netlify, persist to a gitignored file.
const DEV_FILE = path.join(process.cwd(), ".notes-dev.json");

const MAX_TEXT = 2000;
const MAX_AUTHOR = 80;

// ── Storage layer ──────────────────────────────────────────────
// Each note is stored under its own blob key so concurrent writes can
// never clobber each other — important for something meant to last 18 years.

async function readAll(): Promise<Note[]> {
  try {
    const store = getStore(STORE_NAME);
    const { blobs } = await store.list();
    const notes = await Promise.all(
      blobs.map((b) => store.get(b.key, { type: "json" }) as Promise<Note | null>)
    );
    return notes.filter((n): n is Note => !!n).sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    // Local dev (no Netlify runtime) → read from disk.
    return readDevFile();
  }
}

async function addNote(note: Note): Promise<void> {
  try {
    const store = getStore(STORE_NAME);
    await store.setJSON(note.id, note);
  } catch {
    const notes = await readDevFile();
    notes.unshift(note);
    await fs.writeFile(DEV_FILE, JSON.stringify(notes, null, 2), "utf8");
  }
}

async function readDevFile(): Promise<Note[]> {
  try {
    const raw = await fs.readFile(DEV_FILE, "utf8");
    const parsed = JSON.parse(raw) as Note[];
    return parsed.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

// ── Routes ─────────────────────────────────────────────────────

export async function GET() {
  const notes = await readAll();
  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  let body: Partial<Note>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const text = (body.text ?? "").toString().trim().slice(0, MAX_TEXT);
  if (!text) {
    return NextResponse.json({ error: "A note can't be empty." }, { status: 400 });
  }

  const author = ((body.author ?? "").toString().trim() || "Anonymous").slice(0, MAX_AUTHOR);

  let revealAge: number | null = null;
  if (typeof body.revealAge === "number" && body.revealAge > 0) {
    revealAge = Math.min(99, Math.round(body.revealAge));
  }

  const date =
    (body.date ?? "").toString().trim().slice(0, 40) ||
    new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const note: Note = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    author,
    date,
    revealAge,
    createdAt: Date.now(),
  };

  await addNote(note);
  return NextResponse.json({ note }, { status: 201 });
}
