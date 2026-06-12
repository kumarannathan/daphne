"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

type Range = "1M" | "6M" | "1Y" | "ALL";
const RANGES: Range[] = ["1M", "6M", "1Y", "ALL"];

function generateData(range: Range, startValue: number) {
  const annualReturn = 0.10;
  const dailyReturn = Math.pow(1 + annualReturn, 1 / 365) - 1;
  const days = range === "1M" ? 30 : range === "6M" ? 180 : 365;
  const result = [];
  let value = startValue * 0.94;
  const startDate = new Date("2026-06-12");
  startDate.setDate(startDate.getDate() - (days - 1));

  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const noise = (Math.random() - 0.48) * 0.016;
    value = value * (1 + dailyReturn + noise);
    result.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: range === "1M" ? "numeric" : undefined }),
      value: parseFloat(value.toFixed(2)),
    });
  }
  return result;
}

interface TooltipProps { active?: boolean; payload?: Array<{ value: number }>; label?: string; }

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "white", border: "2px solid var(--border)", borderRadius: 14, padding: "10px 16px", boxShadow: "3px 3px 0px var(--coral-light)" }}>
      <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 2 }}>{label}</p>
      <p style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "1.15rem", fontWeight: 600, color: "var(--coral)" }}>
        ${payload[0].value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  );
}

export default function GrowthChart({ startValue }: { startValue: number }) {
  const [range, setRange] = useState<Range>("1Y");
  const data = useMemo(() => generateData(range, startValue), [range, startValue]);
  const first = data[0]?.value ?? startValue;
  const last = data[data.length - 1]?.value ?? startValue;
  const gain = last - first;
  const gainPct = (gain / first) * 100;

  return (
    <section style={{ padding: "60px 24px", background: "var(--peach)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="section-label">Portfolio Performance</div>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
            Watching Daphne&apos;s Future Grow 📈
          </h2>
          <p style={{ fontFamily: "'Quicksand', sans-serif", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Projected at 10% annual return · illustrative only
          </p>
        </div>

        {/* Range tabs */}
        <div className="no-print" style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: "8px 20px",
                borderRadius: 100,
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 500,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
                background: range === r ? "var(--coral)" : "white",
                color: range === r ? "white" : "var(--text-soft)",
                border: `2px solid ${range === r ? "var(--coral-dark)" : "var(--border)"}`,
                boxShadow: range === r ? "2px 2px 0px var(--coral-dark)" : "2px 2px 0px var(--border)",
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Gain pill */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 }}>
          {[
            { label: `${range} Gain`, value: `${gain >= 0 ? "+" : ""}$${Math.abs(gain).toFixed(2)}` },
            { label: `${range} Return`, value: `${gainPct >= 0 ? "+" : ""}${gainPct.toFixed(2)}%` },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: "10px 20px", background: "white", border: "2px solid var(--border)", borderRadius: 14, boxShadow: "3px 3px 0px var(--border)", textAlign: "center" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 2 }}>{label}</div>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "1.15rem", fontWeight: 600, color: gain >= 0 ? "#2E7D32" : "#C62828" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="card" style={{ padding: "20px 16px 12px" }}>
          <div className="chart-wrapper" style={{ height: 300, minHeight: 300 }}>
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="coralGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#F4846A" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F4846A" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" strokeOpacity={0.5} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "'Quicksand', sans-serif" }} tickLine={false} axisLine={false} interval={range === "1M" ? 4 : 49} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "'Quicksand', sans-serif" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v.toFixed(2)}`} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={first} stroke="var(--coral-light)" strokeDasharray="4 4" strokeWidth={1.5} />
                <Area type="monotoneX" dataKey="value" stroke="var(--coral)" strokeWidth={2.5} fill="url(#coralGrad)" dot={false} activeDot={{ r: 5, fill: "var(--coral)", stroke: "white", strokeWidth: 2.5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
