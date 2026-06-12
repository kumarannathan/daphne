import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";

// Daphne's birthday: June 12, 2025. Every year, the first visit on/after her
// birthday automatically records that year's portfolio value — building an
// 18-year ledger with zero maintenance.

export interface DiaryEntry {
  age: number; // how old she turned that birthday
  value: number;
  invested: number;
  recordedAt: string; // ISO date the snapshot was actually taken
}

const BIRTH = { year: 2025, month: 5, day: 12 }; // month is 0-indexed (June)
const STORE_NAME = "daphne-diary";
const DEV_FILE = path.join(process.cwd(), ".diary-dev.json");

export function currentAge(now = new Date()): number {
  let age = now.getFullYear() - BIRTH.year;
  const hadBirthdayThisYear =
    now.getMonth() > BIRTH.month ||
    (now.getMonth() === BIRTH.month && now.getDate() >= BIRTH.day);
  if (!hadBirthdayThisYear) age -= 1;
  return age;
}

async function readAll(): Promise<DiaryEntry[]> {
  try {
    const store = getStore(STORE_NAME);
    const { blobs } = await store.list();
    const entries = await Promise.all(
      blobs.map((b) => store.get(b.key, { type: "json" }) as Promise<DiaryEntry | null>)
    );
    return entries.filter((e): e is DiaryEntry => !!e);
  } catch {
    try {
      const raw = await fs.readFile(DEV_FILE, "utf8");
      return JSON.parse(raw) as DiaryEntry[];
    } catch {
      return [];
    }
  }
}

async function save(entry: DiaryEntry, existing: DiaryEntry[]): Promise<void> {
  try {
    const store = getStore(STORE_NAME);
    await store.setJSON(`age-${entry.age}`, entry);
  } catch {
    await fs.writeFile(DEV_FILE, JSON.stringify([...existing, entry], null, 2), "utf8");
  }
}

// Reads the diary and, if her latest birthday hasn't been captured yet,
// records today's portfolio value for it.
export async function getDiaryWithSnapshot(value: number, invested: number): Promise<DiaryEntry[]> {
  const age = currentAge();
  const entries = await readAll();

  if (age >= 1 && !entries.some((e) => e.age === age)) {
    const entry: DiaryEntry = {
      age,
      value: Math.round(value * 100) / 100,
      invested: Math.round(invested * 100) / 100,
      recordedAt: new Date().toISOString().split("T")[0],
    };
    await save(entry, entries);
    entries.push(entry);
  }

  return entries.sort((a, b) => a.age - b.age);
}

export function birthdayYearForAge(age: number): number {
  return BIRTH.year + age;
}
