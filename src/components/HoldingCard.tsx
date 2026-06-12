"use client";

import { Holding } from "@/config/holdings";
import { StockPrice } from "@/lib/stockApi";

interface HoldingCardProps {
  holding: Holding;
  price: StockPrice;
}

export default function HoldingCard({ holding, price }: HoldingCardProps) {
  const currentValue = holding.shares * price.price;
  const gain = currentValue - holding.amountInvested;
  const gainPct = (gain / holding.amountInvested) * 100;
  const isPositive = gain >= 0;

  return (
    <div className="card pop-in" style={{ padding: "24px" }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
        {/* Mascot */}
        <div className="mascot" style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: "var(--peach)",
          border: "2px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: "1.7rem",
          lineHeight: 1,
        }}>
          <span role="img" aria-label={holding.name}>{holding.mascot}</span>
        </div>

        {/* Name + ticker */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span className="badge" style={{ color: holding.accentColor, borderColor: holding.accentColor, background: `${holding.accentColor}18` }}>
              {holding.ticker}
            </span>
          </div>
          <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "1rem", fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>
            {holding.name}
          </h3>
        </div>

        {/* Return chip */}
        <div style={{
          padding: "6px 12px",
          borderRadius: 100,
          background: isPositive ? "#E8F5E9" : "#FFEBEE",
          border: `2px solid ${isPositive ? "#A5D6A7" : "#EF9A9A"}`,
          textAlign: "center",
          flexShrink: 0,
        }}>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "0.95rem", fontWeight: 600, color: isPositive ? "#2E7D32" : "#C62828" }}>
            {isPositive ? "▲" : "▼"} {Math.abs(gainPct).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.5 }}>
        {holding.description}
      </p>

      <hr className="dot-divider" style={{ marginBottom: 16 }} />

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { label: "Shares", value: holding.shares < 1 ? holding.shares.toFixed(4) : holding.shares.toString() },
          { label: "Price", value: `$${price.price.toFixed(2)}` },
          { label: "Value", value: `$${currentValue.toFixed(2)}` },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: "center", padding: "10px 6px", background: "var(--peach)", borderRadius: 12, border: "1.5px solid var(--border)" }}>
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 2 }}>
              {label}
            </div>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "0.95rem", fontWeight: 600, color: "var(--text)" }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Today footer */}
      <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Today&apos;s change</span>
        <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "0.9rem", fontWeight: 500, color: price.changePercent >= 0 ? "#2E7D32" : "#C62828" }}>
          {price.changePercent >= 0 ? "+" : ""}{price.changePercent.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
