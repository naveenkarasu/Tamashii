import { useMemo } from "react";

interface Particle {
  id: number;
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

/**
 * SparkleParticles - CSS sparkle particle overlay for anime mode.
 *
 * Renders 25 small fixed-position div elements that use the `.sparkle`
 * class defined in index.css (keyframes: fade in, float upward, fade out).
 * Each particle gets randomised position, delay, and duration so the
 * effect looks organic rather than synchronised.
 *
 * z-index: 0 keeps particles behind interactive content but above the
 * mesh gradient background.
 */

function generateParticles(): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < 25; i++) {
    particles.push({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
    });
  }
  return particles;
}

interface SparkleParticlesProps {
  visible: boolean;
}

export function SparkleParticles({ visible }: SparkleParticlesProps) {
  const particles = useMemo(() => generateParticles(), []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none"
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="sparkle"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
          }}
        />
      ))}
    </div>
  );
}
