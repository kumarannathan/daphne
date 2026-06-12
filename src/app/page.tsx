import { HOLDINGS, TOTAL_INVESTED } from "@/config/holdings";
import { fetchAllPrices } from "@/lib/stockApi";
import { getDiaryWithSnapshot } from "@/lib/diary";
import Hero from "@/components/Hero";
import HoldingCard from "@/components/HoldingCard";
import GrowthDiary from "@/components/GrowthDiary";
import MemoryNotes from "@/components/MemoryNotes";
import VoiceNotes from "@/components/VoiceNotes";
import PasswordGate from "@/components/PasswordGate";

// Yes, the prices are fetched live from Yahoo Finance via the stockApi.ts!
export const revalidate = 60;

export default async function Home() {
  const tickers = HOLDINGS.map((h) => h.ticker);
  const prices = await fetchAllPrices(tickers);
  const priceMap = Object.fromEntries(prices.map((p) => [p.ticker, p]));

  const currentValue = HOLDINGS.reduce((sum, h) => {
    const p = priceMap[h.ticker]?.price ?? h.costBasis;
    return sum + h.shares * p;
  }, 0);

  const totalReturn = currentValue - TOTAL_INVESTED;
  const totalReturnPct = TOTAL_INVESTED > 0 ? (totalReturn / TOTAL_INVESTED) * 100 : 0;

  // Auto-records this year's value on the first visit after each birthday.
  const diaryEntries = await getDiaryWithSnapshot(currentValue, TOTAL_INVESTED);

  return (
    <PasswordGate>
      <main style={{ minHeight: "100vh" }}>
        {/* Hero */}
        <Hero
          totalInvested={TOTAL_INVESTED}
          currentValue={currentValue}
          totalReturn={totalReturn}
          totalReturnPct={totalReturnPct}
        />

        {/* Holdings Section */}
        <section style={{ padding: "80px 24px", background: "var(--peach-mid)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="section-label">The Portfolio</div>
              <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                Daphne&apos;s Holdings
              </h2>
              <p style={{ fontFamily: "'Quicksand', sans-serif", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                {HOLDINGS.length} positions · Live prices updated every minute
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
              {HOLDINGS.map((holding) => {
                const price = priceMap[holding.ticker] ?? {
                  ticker: holding.ticker, price: holding.costBasis, previousClose: holding.costBasis, change: 0, changePercent: 0,
                };
                return <HoldingCard key={holding.ticker} holding={holding} price={price} />;
              })}
            </div>

            {/* Allocation Bar */}
            <div className="card" style={{ marginTop: 40, padding: "24px 32px" }}>
              <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "1.2rem", fontWeight: 600, color: "var(--text)", marginBottom: 20, textAlign: "center" }}>
                Portfolio Allocation
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {HOLDINGS.map((h) => {
                  const val = h.shares * (priceMap[h.ticker]?.price ?? h.costBasis);
                  const pct = (val / currentValue) * 100;
                  return (
                    <div key={h.ticker}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 6, fontFamily: "'Quicksand', sans-serif", fontWeight: 700 }}>
                        <span style={{ color: "var(--text)" }}>{h.ticker}</span>
                        <span style={{ color: "var(--text-muted)" }}>{pct.toFixed(1)}%</span>
                      </div>
                      <div style={{ height: 12, background: "var(--peach)", borderRadius: 100, border: "2px solid var(--border)", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: h.accentColor,
                            borderRight: "2px solid var(--border)",
                            transition: "width 1s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Growth Diary */}
        <GrowthDiary entries={diaryEntries} />

        {/* Memory Notes */}
        <MemoryNotes />

        {/* Voice Notes */}
        <VoiceNotes />

        {/* Footer */}
        <footer style={{ padding: "48px 24px", textAlign: "center", background: "white", borderTop: "2.5px dashed var(--coral-light)" }}>
          <div className="heartbeat" aria-label="love" style={{ fontSize: "2rem", color: "var(--coral)", lineHeight: 1, marginBottom: 10 }}>
            ♥
          </div>
          <p style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "1.1rem", color: "var(--text-soft)", marginBottom: 8 }}>
            Made for Daphne, with all our love
          </p>
          <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 16 }}>
            Est. June 12, 2026 · Not financial advice
          </p>
        </footer>
      </main>
    </PasswordGate>
  );
}
