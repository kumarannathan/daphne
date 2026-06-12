"use client";

function CuteSeal() {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer scalloped circle */}
      <path d="M50 4 C55 4, 58 8, 64 8 C68 8, 72 5, 77 8 C81 11, 80 16, 85 20 C89 24, 95 25, 96 31 C97 36, 92 39, 93 45 C94 50, 99 53, 97 59 C95 64, 90 64, 86 69 C82 74, 83 80, 78 84 C73 88, 68 85, 63 88 C58 91, 54 96, 49 96 C44 96, 40 91, 35 88 C30 85, 25 88, 20 84 C15 80, 16 74, 12 69 C8 64, 3 64, 1 59 C-1 53, 4 50, 5 45 C6 39, 1 36, 2 31 C3 25, 9 24, 13 20 C18 16, 17 11, 21 8 C26 5, 30 8, 34 8 C40 8, 43 4, 48 4" fill="var(--coral)" stroke="var(--coral-dark)" strokeWidth="3" />
      {/* Inner white circle */}
      <circle cx="49" cy="50" r="32" fill="white" stroke="var(--coral-dark)" strokeWidth="3" />
      {/* Ribbon tails */}
      <path d="M40 85 L35 110 L45 105 L55 110 L50 85 Z" fill="var(--sky)" stroke="var(--coral-dark)" strokeWidth="3" />
      {/* Text inside */}
      <text x="49" y="46" textAnchor="middle" fontSize="9" fontFamily="'Fredoka', sans-serif" fill="var(--coral)" fontWeight="700">
        OFFICIAL
      </text>
      <text x="49" y="56" textAnchor="middle" fontSize="8" fontFamily="'Fredoka', sans-serif" fill="var(--coral)" fontWeight="600">
        INVESTOR
      </text>
      <text x="49" y="65" textAnchor="middle" fontSize="7" fontFamily="'Nunito', sans-serif" fill="var(--text-muted)" fontWeight="600">
        2026
      </text>
    </svg>
  );
}

export default function Certificate() {
  return (
    <section style={{ padding: "80px 24px", background: "var(--peach)" }} className="no-print">
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="section-label">Official Document</div>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: "var(--text)" }}>
            Certificate of Investment 🏆
          </h2>
        </div>

        {/* Certificate Card */}
        <div style={{
          background: "white",
          border: "4px solid var(--coral)",
          borderRadius: 32,
          padding: "48px 32px",
          boxShadow: "8px 8px 0px var(--coral-light)",
          position: "relative",
          textAlign: "center",
          overflow: "hidden"
        }}>
          {/* Inner cute border */}
          <div style={{ position: "absolute", top: 16, left: 16, right: 16, bottom: 16, border: "3px dashed var(--coral-light)", borderRadius: 20, pointerEvents: "none" }} />

          <p style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--coral)", marginBottom: 32 }}>
            ✦ First Birthday Portfolio ✦
          </p>

          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "clamp(2rem, 6vw, 4rem)", fontWeight: 700, color: "var(--text)", lineHeight: 1.1, marginBottom: 8 }}>
            CERTIFIED BALLER
          </h2>

          <div style={{ margin: "24px auto", width: 80, height: 4, background: "var(--coral-light)", borderRadius: 4 }} />

          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "1.1rem", color: "var(--text-muted)", marginBottom: 12 }}>
            This certificate is proudly presented to
          </p>

          <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: "clamp(3rem, 8vw, 5.5rem)", color: "var(--coral)", lineHeight: 1, marginBottom: 32, transform: "rotate(-2deg)" }}>
            Daphne
          </h3>

          {/* Cute seal */}
          <div className="float" style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <CuteSeal />
          </div>

          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "1rem", color: "var(--text-soft)", marginBottom: 4 }}>
            In recognition of her extraordinary investment acumen
          </p>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.95rem", color: "var(--text-muted)", fontStyle: "italic", marginBottom: 32 }}>
            on this day, June 12, 2026
          </p>

          {/* Signatures */}
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", marginTop: 40, padding: "0 20px" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "2rem", color: "var(--text)", marginBottom: 4 }}>
                Karthik
              </p>
              <div style={{ height: 3, width: 120, background: "var(--border)", borderRadius: 2, marginBottom: 4 }} />
              <p style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Signed</p>
            </div>

            <div style={{ fontSize: 24, paddingBottom: 24 }} className="wiggle">🌸</div>

            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "2rem", color: "var(--text)", marginBottom: 4 }}>
                Kumi
              </p>
              <div style={{ height: 3, width: 120, background: "var(--border)", borderRadius: 2, marginBottom: 4 }} />
              <p style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Signed</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
