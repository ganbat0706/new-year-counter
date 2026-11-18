import type { SeasonKey } from "@/lib/seasons";

/** Улирал бүрийн тэмдэг — гарчгийн дээр хөвнө. */
export function SeasonGlyph({
  season,
  className = "",
}: {
  season: SeasonKey;
  className?: string;
}) {
  if (season === "winter") {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
        className={className}
        aria-hidden
      >
        {[0, 60, 120].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 50 50)`}>
            <line x1="50" y1="8" x2="50" y2="92" />
            <path d="M50 20 L38 30 M50 20 L62 30" />
            <path d="M50 80 L38 70 M50 80 L62 70" />
            <path d="M50 42 L41 49 M50 42 L59 49" />
            <path d="M50 58 L41 51 M50 58 L59 51" />
          </g>
        ))}
      </svg>
    );
  }

  if (season === "spring") {
    return (
      <svg viewBox="0 0 100 100" className={className} aria-hidden>
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="50"
            cy="28"
            rx="15"
            ry="22"
            fill="currentColor"
            opacity="0.85"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="9" fill="var(--s-accent-2)" />
      </svg>
    );
  }

  if (season === "summer") {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="round"
        aria-hidden
      >
        <circle cx="50" cy="50" r="20" fill="currentColor" stroke="none" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="50"
            y1="12"
            x2="50"
            y2="26"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <path
        d="M78 16 C 40 18 14 42 16 76 C 50 80 82 56 78 16 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M20 82 C 36 62 56 42 76 22"
        fill="none"
        stroke="var(--s-near)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
