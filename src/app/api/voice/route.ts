import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export interface VoiceNoteMeta {
  id: string;
  author: string;
  date: string;
  mime: string;
}

const STORE_NAME = "daphne-voice";
// Local-dev fallback directory (gitignored).
const DEV_DIR = path.join(process.cwd(), ".voice-dev");

const MAX_BYTES = 5 * 1024 * 1024; // ~5MB ≈ a couple minutes of compressed audio
const MAX_AUTHOR = 80;

async function listAll(): Promise<VoiceNoteMeta[]> {
  try {
    const store = getStore(STORE_NAME);
    const { blobs } = await store.list();
    const metas = await Promise.all(
      blobs.map(async (b) => {
        const res = await store.getMetadata(b.key);
        const m = (res?.metadata ?? {}) as Partial<VoiceNoteMeta>;
        return {
          id: b.key,
          author: m.author ?? "Anonymous",
          date: m.date ?? "",
          mime: m.mime ?? "audio/webm",
        };
      })
    );
    return metas.sort((a, b) => b.id.localeCompare(a.id));
  } catch {
    try {
      const files = await fs.readdir(DEV_DIR);
      const metas: VoiceNoteMeta[] = [];
      for (const f of files.filter((f) => f.endsWith(".json"))) {
        metas.push(JSON.parse(await fs.readFile(path.join(DEV_DIR, f), "utf8")));
      }
      return metas.sort((a, b) => b.id.localeCompare(a.id));
    } catch {
      return [];
    }
  }
}

export async function GET() {
  const notes = await listAll();
  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("audio");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No audio received." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "That recording is a bit too long." }, { status: 413 });
  }

  const author = ((form.get("author") ?? "").toString().trim() || "Anonymous").slice(0, MAX_AUTHOR);
  const mime = file.type || "audio/webm";
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const buffer = await file.arrayBuffer();

  const meta: VoiceNoteMeta = { id, author, date, mime };

  try {
    const store = getStore(STORE_NAME);
    await store.set(id, buffer, { metadata: { author, date, mime } });
  } catch {
    await fs.mkdir(DEV_DIR, { recursive: true });
    await fs.writeFile(path.join(DEV_DIR, `${id}.bin`), Buffer.from(buffer));
    await fs.writeFile(path.join(DEV_DIR, `${id}.json`), JSON.stringify(meta), "utf8");
  }

  return NextResponse.json({ note: meta }, { status: 201 });
}
