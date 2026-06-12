"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  glyph: string;
  opacity: number;
}

const GLYPHS = ["✦", "♡", "✿", "★", "·", "❋", "○"];

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const items: Particle[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 8,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.3 + 0.15,
      glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
    }));
    setParticles(items);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            color: "var(--coral)",
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${3 + p.delay * 0.5}s`,
          }}
        >
          {p.glyph}
        </span>
      ))}
    </div>
  );
}
