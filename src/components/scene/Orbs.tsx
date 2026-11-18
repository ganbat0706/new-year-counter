import { seededRandom } from "@/lib/random";

/**
 * Хөвөх гэрлүүд. `firefly` горимд богино, огцом анивчилттай болж
 * зуны галт шувуу болно; эс бөгөөс бүдэг bokeh толбо.
 */
export function Orbs({
  seed,
  count,
  mode = "bokeh",
}: {
  seed: number;
  count: number;
  mode?: "bokeh" | "firefly";
}) {
  const random = seededRandom(seed);
  const firefly = mode === "firefly";

  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, index) => {
        const size = firefly ? 2 + random() * 3 : 36 + random() * 120;
        const duration = firefly ? 4 + random() * 6 : 14 + random() * 14;
        const color = index % 3 === 0 ? "var(--s-accent-2)" : "var(--s-accent)";

        return (
          <span
            key={index}
            className={`absolute rounded-full ${
              firefly ? "animate-firefly" : "animate-bokeh blur-2xl"
            }`}
            style={{
              left: `${random() * 100}%`,
              top: `${(firefly ? 45 : 18) + random() * (firefly ? 45 : 70)}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: color,
              boxShadow: firefly
                ? `0 0 ${size * 4}px ${size}px rgb(var(--s-glow) / 0.55)`
                : undefined,
              animationDuration: `${duration}s`,
              animationDelay: `-${random() * duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}
