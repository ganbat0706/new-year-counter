const BULB_COUNT = 34;
const SWAGS = 3;
/** Унжилтын гүн ба хэлхээний SVG өндөр (px) — хоёулаа ижил координатад. */
const SAG = 34;
const WIRE_HEIGHT = 56;

const BULB_COLORS = [
  "var(--s-accent)",
  "var(--s-accent-2)",
  "rgb(var(--s-ground))",
  "var(--s-accent)",
];

/** i-р чийдэнгийн хэвтээ (%) ба босоо (px) байрлал. */
function bulbPosition(index: number) {
  const t = index / (BULB_COUNT - 1);
  const phase = (t * SWAGS) % 1;
  return { left: t * 100, top: 6 + Math.sin(Math.PI * phase) * SAG };
}

/** Чийдэнгүүдийн яг дээгүүр татагдсан утас. */
function wirePath() {
  const points = Array.from({ length: 121 }, (_, i) => {
    const t = i / 120;
    const phase = (t * SWAGS) % 1;
    const y = 6 + Math.sin(Math.PI * phase) * SAG;
    return `${(t * 1000).toFixed(1)},${y.toFixed(2)}`;
  });
  return `M${points.join(" L")}`;
}

export function Garland() {
  return (
    <div
      aria-hidden
      className="animate-float pointer-events-none fixed inset-x-0 top-0 z-20"
      style={{ height: WIRE_HEIGHT, animationDuration: "11s" }}
    >
      <svg
        viewBox={`0 0 1000 ${WIRE_HEIGHT}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d={wirePath()}
          fill="none"
          stroke="var(--s-near)"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {Array.from({ length: BULB_COUNT }, (_, index) => {
        const { left, top } = bulbPosition(index);

        return (
          <span
            key={index}
            className="animate-blink absolute h-2.5 w-2.5 rounded-full bg-current"
            style={{
              color: BULB_COLORS[index % BULB_COLORS.length],
              left: `${left}%`,
              top: `${top}px`,
              marginLeft: "-5px",
              animationDelay: `-${(index % 7) * 0.48}s`,
            }}
          />
        );
      })}
    </div>
  );
}
