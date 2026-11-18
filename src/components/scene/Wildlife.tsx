import { seededRandom } from "@/lib/random";

/**
 * Нисэх шувуудын сүрэг. Гадна элемент нь нислэгийн замыг, дотоод svg нь
 * далавчны цохилтыг зэрэг биш тусад нь гүйцэтгэнэ.
 */
export function Birds({ seed, count }: { seed: number; count: number }) {
  const random = seededRandom(seed);

  return (
    <div className="motion-only absolute inset-x-0 top-0 h-[55vh] overflow-hidden text-near">
      {Array.from({ length: count }, (_, index) => {
        const width = 14 + random() * 18;
        const duration = 26 + random() * 34;
        const flap = 0.3 + random() * 0.28;

        return (
          <span
            key={index}
            className="animate-fly absolute left-0 block"
            style={{
              top: `${8 + random() * 46}%`,
              opacity: 0.35 + random() * 0.45,
              animationDuration: `${duration}s`,
              animationDelay: `-${random() * duration}s`,
            }}
          >
            <svg
              viewBox="0 0 24 10"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              className="animate-flap block"
              style={{
                width: `${width}px`,
                animationDuration: `${flap}s`,
                animationDelay: `-${random() * flap}s`,
              }}
            >
              <path d="M1 8 Q 6.5 1 12 6 Q 17.5 1 23 8" />
            </svg>
          </span>
        );
      })}
    </div>
  );
}

/** Хаврын эрвээхэйнүүд — тойрон аялж, далавчаа дэвнэ. */
export function Butterflies({ seed, count }: { seed: number; count: number }) {
  const random = seededRandom(seed);

  return (
    <div className="motion-only absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, index) => {
        const size = 12 + random() * 12;
        const travel = 22 + random() * 20;
        const flap = 0.22 + random() * 0.2;

        return (
          <span
            key={index}
            className="animate-wander absolute block"
            style={{
              left: `${8 + random() * 72}%`,
              top: `${28 + random() * 48}%`,
              animationDuration: `${travel}s`,
              animationDelay: `-${random() * travel}s`,
            }}
          >
            <svg
              viewBox="0 0 24 20"
              className="animate-flap block drop-shadow-[0_0_8px_rgb(var(--s-glow)/0.7)]"
              style={{
                width: `${size}px`,
                animationDuration: `${flap}s`,
                animationDelay: `-${random() * flap}s`,
              }}
            >
              <ellipse cx="7" cy="8" rx="6.5" ry="7" fill="var(--s-accent)" opacity="0.9" />
              <ellipse cx="17" cy="8" rx="6.5" ry="7" fill="var(--s-accent)" opacity="0.9" />
              <ellipse cx="8" cy="15" rx="4.5" ry="4.5" fill="var(--s-accent-2)" opacity="0.75" />
              <ellipse cx="16" cy="15" rx="4.5" ry="4.5" fill="var(--s-accent-2)" opacity="0.75" />
              <rect x="11.2" y="3" width="1.6" height="15" rx="0.8" fill="var(--s-near)" />
            </svg>
          </span>
        );
      })}
    </div>
  );
}
