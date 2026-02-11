import { useState, useCallback, useRef } from "react";
import { RefreshCw } from "lucide-react";
import { quotes } from "../../lib/quotes";
import { Card } from "../shared/Card";

function getRandomQuote(excludeId?: number) {
  const pool = excludeId
    ? quotes.filter((q) => q.id !== excludeId)
    : quotes;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function DailyQuote() {
  const [currentQuote, setCurrentQuote] = useState(() => getRandomQuote());
  const [spinning, setSpinning] = useState(false);
  const spinTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(() => {
    setSpinning(true);
    setCurrentQuote((prev) => getRandomQuote(prev.id));

    // Reset spin after the CSS transition completes
    if (spinTimeout.current) clearTimeout(spinTimeout.current);
    spinTimeout.current = setTimeout(() => setSpinning(false), 500);
  }, []);

  return (
    <Card className="relative px-5 py-4">
      {/* Refresh button - top right */}
      <button
        onClick={refresh}
        aria-label="New quote"
        className="absolute top-3 right-3 text-text-secondary hover:text-accent transition-colors cursor-pointer"
      >
        <RefreshCw
          size={16}
          className="transition-transform duration-500 ease-in-out"
          style={{
            transform: spinning ? "rotate(360deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Quote text */}
      <p className="font-sans italic text-base text-text-primary pr-8 leading-relaxed">
        &ldquo;{currentQuote.text}&rdquo;
      </p>

      {/* Author */}
      <p className="font-mono text-sm mt-2" style={{ color: "var(--mono-text)" }}>
        &mdash; {currentQuote.author}
      </p>
    </Card>
  );
}
