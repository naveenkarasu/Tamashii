import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * BreathingExercise - Animated SVG breathing circle with GSAP timeline.
 *
 * Cycle (14s total, repeats infinitely):
 *   Phase 1 (0-4s):  Breathe in   - circle scales 0.5 -> 1.0, countdown 4..1
 *   Phase 2 (4-8s):  Hold          - circle stays 1.0, subtle glow pulse, countdown 4..1
 *   Phase 3 (8-14s): Breathe out   - circle scales 1.0 -> 0.5, countdown 6..1
 */
export function BreathingExercise() {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (
        !circleRef.current ||
        !labelRef.current ||
        !countRef.current
      )
        return;

      const circle = circleRef.current;
      const label = labelRef.current;
      const count = countRef.current;

      // Helper: update the visible text imperatively (no React re-render).
      const setText = (phase: string, num: string) => {
        label.textContent = phase;
        count.textContent = num;
      };

      // ----------------------------------------------------------
      // Build the master timeline (14 s total, infinite repeat)
      // ----------------------------------------------------------
      const tl = gsap.timeline({ repeat: -1 });

      // ---------- Phase 1: Breathe In (0 – 4 s) ----------
      // Scale circle from 0.5 to 1.0 over 4 s
      tl.fromTo(
        circle,
        { scale: 0.5, transformOrigin: "center center" },
        {
          scale: 1,
          duration: 4,
          ease: "sine.inOut",
          transformOrigin: "center center",
        },
        0
      );

      // Countdown labels at each second boundary
      for (let i = 4; i >= 1; i--) {
        tl.call(
          () => setText("Breathe in...", String(i)),
          [],
          4 - i // t=0 -> "4", t=1 -> "3", etc.
        );
      }

      // ---------- Phase 2: Hold (4 – 8 s) ----------
      // Circle stays at scale 1; add a subtle glow pulse
      tl.to(
        circle,
        {
          filter:
            "drop-shadow(0 0 20px var(--accent))",
          duration: 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 1,
        },
        4
      );

      for (let i = 4; i >= 1; i--) {
        tl.call(
          () => setText("Hold...", String(i)),
          [],
          4 + (4 - i) // t=4 -> "4", t=5 -> "3", …
        );
      }

      // ---------- Phase 3: Breathe Out (8 – 14 s) ----------
      tl.to(
        circle,
        {
          scale: 0.5,
          filter:
            "drop-shadow(0 0 10px var(--accent))",
          duration: 6,
          ease: "sine.inOut",
          transformOrigin: "center center",
        },
        8
      );

      for (let i = 6; i >= 1; i--) {
        tl.call(
          () => setText("Breathe out...", String(i)),
          [],
          8 + (6 - i) // t=8 -> "6", t=9 -> "5", …
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center gap-4"
    >
      {/* SVG breathing circle */}
      <div className="relative flex items-center justify-center w-[200px] h-[200px]">
        <svg
          viewBox="0 0 200 200"
          width="200"
          height="200"
          className="absolute inset-0"
        >
          <circle
            ref={circleRef}
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            style={{
              filter: "drop-shadow(0 0 10px var(--accent))",
              transformOrigin: "center center",
            }}
          />
        </svg>

        {/* Countdown number rendered on top of the circle */}
        <span
          ref={countRef}
          className="relative z-10 font-mono text-3xl text-accent select-none"
        >
          4
        </span>
      </div>

      {/* Phase label below the circle */}
      <span
        ref={labelRef}
        className="font-sans text-lg text-text-secondary select-none"
      >
        Breathe in...
      </span>
    </div>
  );
}
