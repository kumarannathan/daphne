import { DiaryEntry, birthdayYearForAge } from "@/lib/diary";

// A little 18-year ledger: every birthday the site auto-records the portfolio
// value, and this renders the journey — filled years and the road ahead.
export default function GrowthDiary({ entries }: { entries: DiaryEntry[] }) {
  const byAge = new Map(entries.map((e) => [e.age, e]));
  const ages = Array.from({ length: 18 }, (_, i) => i + 1);

  return (
    <section style={{ padding: "80px 24px", background: "var(--peach)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="section-label">The Long Game</div>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
            Growth Diary 📖
          </h2>
          <p style={{ fontFamily: "'Quicksand', sans-serif", color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: 480, margin: "0 auto" }}>
            Every birthday, the site jots down what her little nest egg is worth — all by itself, for the next 18 years.
          </p>
        </div>

        <div className="diary-grid">
          {ages.map((age) => {
            const entry = byAge.get(age);
            return (
              <div key={age} className={entry ? "diary-cell diary-cell-filled" : "diary-cell"}>
                <div className="diary-age">Age {age}</div>
                {entry ? (
                  <>
                    <div className="diary-value">${entry.value.toFixed(2)}</div>
                    <div className="diary-year">June {birthdayYearForAge(age)} ✨</div>
                  </>
                ) : (
                  <>
                    <div className="diary-value diary-value-empty">· · ·</div>
                    <div className="diary-year">June {birthdayYearForAge(age)}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
