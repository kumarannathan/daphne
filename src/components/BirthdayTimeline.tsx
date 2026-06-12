"use client";

interface Milestone {
  age: number;
  emoji: string;
  label: string;
  description: string;
  isActive: boolean;
}

const MILESTONES: Milestone[] = [
  { age: 1,  emoji: "🎂", label: "Age 1",  description: "Portfolio created",     isActive: true  },
  { age: 5,  emoji: "🧸", label: "Age 5",  description: "First kindergarten year", isActive: false },
  { age: 10, emoji: "🚲", label: "Age 10", description: "Double digits",           isActive: false },
  { age: 16, emoji: "🚗", label: "Age 16", description: "Driving age",             isActive: false },
  { age: 18, emoji: "🎓", label: "Age 18", description: "College age",             isActive: false },
  { age: 21, emoji: "✨", label: "Age 21", description: "Adult investor!",         isActive: false },
];

function projectValue(startValue: number, yearsFromNow: number): number {
  return startValue * Math.pow(1.08, yearsFromNow);
}

export default function BirthdayTimeline({ currentValue }: { currentValue: number }) {
  return (
    <section style={{ padding: "80px 24px", background: "white", borderTop: "2.5px dashed var(--coral-light)", borderBottom: "2.5px dashed var(--coral-light)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-label">The Journey Ahead</div>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
            Birthday Milestones 🎈
          </h2>
          <p style={{ fontFamily: "'Quicksand', sans-serif", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Projected at 8% annual return
          </p>
        </div>

        <div style={{ position: "relative" }}>
          {/* Connecting line (desktop) */}
          <div className="hidden md:block" style={{ position: "absolute", top: 28, left: 40, right: 40, height: 4, background: "repeating-linear-gradient(90deg, var(--coral-light) 0px, var(--coral-light) 8px, transparent 8px, transparent 16px)", zIndex: 0 }} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 32, position: "relative", zIndex: 1 }}>
            {MILESTONES.map((m) => {
              const projected = projectValue(currentValue, m.age - 1);
              return (
                <div key={m.age} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  {/* Dot / Emoji */}
                  <div style={{
                    width: 56, height: 56,
                    borderRadius: "50%",
                    background: m.isActive ? "var(--coral)" : "white",
                    border: `3px solid ${m.isActive ? "var(--coral-dark)" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 28,
                    marginBottom: 16,
                    boxShadow: m.isActive ? "3px 3px 0px var(--coral-dark)" : "3px 3px 0px var(--border)",
                    filter: m.isActive ? "none" : "grayscale(0.5) opacity(0.8)",
                  }}>
                    {m.emoji}
                  </div>

                  {/* Age label */}
                  <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "1.1rem", fontWeight: 600, color: m.isActive ? "var(--coral)" : "var(--text)", marginBottom: 4 }}>
                    {m.label}
                  </div>

                  {/* Description */}
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.3, marginBottom: 12, minHeight: 32 }}>
                    {m.description}
                  </div>

                  {/* Est Value Pill */}
                  <div style={{
                    padding: "4px 12px",
                    background: m.isActive ? "var(--peach)" : "white",
                    border: `2px solid ${m.isActive ? "var(--coral-light)" : "var(--border)"}`,
                    borderRadius: 100,
                  }}>
                    <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: 2 }}>
                      Est. Value
                    </div>
                    <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: m.isActive ? "var(--coral)" : "var(--text)" }}>
                      ${projected >= 10000 ? `${(projected / 1000).toFixed(1)}k` : projected.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
