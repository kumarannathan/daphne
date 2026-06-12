import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const STORE_NAME = "daphne-voice";
const DEV_DIR = path.join(process.cwd(), ".voice-dev");

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  // ids are timestamp-random; reject anything else (protects the dev file fallback)
  if (!/^[\w-]+$/.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const store = getStore(STORE_NAME);
    const res = await store.getWithMetadata(id, { type: "arrayBuffer" });
    if (!res?.data) throw new Error("missing");
    const mime = ((res.metadata ?? {}) as { mime?: string }).mime ?? "audio/webm";
    return new Response(res.data, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    try {
      const meta = JSON.parse(await fs.readFile(path.join(DEV_DIR, `${id}.json`), "utf8"));
      const data = await fs.readFile(path.join(DEV_DIR, `${id}.bin`));
      return new Response(new Uint8Array(data), {
        headers: { "Content-Type": meta.mime ?? "audio/webm" },
      });
    } catch {
      return new Response("Not found", { status: 404 });
    }
  }
}
