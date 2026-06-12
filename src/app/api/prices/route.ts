import { NextResponse } from "next/server";
import { fetchAllPrices } from "@/lib/stockApi";
import { HOLDINGS } from "@/config/holdings";

export async function GET() {
  const tickers = HOLDINGS.map((h) => h.ticker);
  const prices = await fetchAllPrices(tickers);
  return NextResponse.json(prices, {
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
    },
  });
}
