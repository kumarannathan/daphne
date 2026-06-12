"use client";

import FloatingParticles from "./FloatingParticles";
import CountUp from "./CountUp";

interface HeroProps {
  totalInvested: number;
  currentValue: number;
  totalReturn: number;
  totalReturnPct: number;
}

function StatBox({ label, value, sub, color }: { label: string; value: React.ReactNode; sub?: string; color?: string }) {
  return (
    <div className="stat-box pop-in">
      <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "1.4rem", fontWeight: 600, color: color ?? "var(--text)", lineHeight: 1.1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{sub}</div>
      )}
    </div>
  );
}

export default function Hero({ totalInvested, currentValue, totalReturn, totalReturnPct }: HeroProps) {
  const isPositive = totalReturn >= 0;

  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "80px 24px 60px", background: "var(--peach)" }}>
      <FloatingParticles />

      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Baby badge */}
        <div style={{ marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 20px", background: "white", border: "2.5px solid var(--border)", borderRadius: 100, boxShadow: "3px 3px 0px var(--coral-light)" }}>
          <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "0.85rem", fontWeight: 500, color: "var(--coral)", letterSpacing: "0.08em" }}>DAPHNE&apos;S FIRST BIRTHDAY PORTFOLIO</span>
        </div>

        {/* Main title */}
        <h1 style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "clamp(2.8rem, 8vw, 5rem)",
          fontWeight: 700,
          color: "var(--text)",
          lineHeight: 1.05,
          marginBottom: 28,
          letterSpacing: "-0.01em",
        }}>
          Daphne&apos;s<br />
          <span style={{ color: "var(--coral)" }}>Investment</span> Portfolio
        </h1>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, maxWidth: 680, margin: "0 auto" }}>
          <StatBox label="Started" value="June 2026" sub="Day one ✦" />
          <StatBox 
            label="Total Invested" 
            value={<span>$<CountUp from={0} to={totalInvested} separator="," duration={2} /></span>} 
          />
          <StatBox 
            label="Current Value" 
            value={<span>$<CountUp from={0} to={currentValue} separator="," duration={2.5} /></span>} 
          />
          <StatBox
            label="Total Return"
            value={<span>{isPositive ? "+" : ""}<CountUp from={0} to={totalReturnPct} duration={2} />%</span>}
            sub={`${isPositive ? "+" : "-"}$${Math.abs(totalReturn).toFixed(2)}`}
            color={isPositive ? "#3D9970" : "#E06D54"}
          />
        </div>
      </div>
    </section>
  );
}
