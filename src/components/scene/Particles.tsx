import { seededRandom } from "@/lib/random";

export type ParticleShape = "snow" | "petal" | "leaf" | "mote";

export type ParticleLayer = {
  seed: number;
  count: number;
  /** Ширхэгийн хэмжээ px-ээр: [доод, дээд] */
  size: [number, number];
  /** Унах/хөвөх хугацаа секундээр: [доод, дээд] */
  duration: [number, number];
  opacity: number;
  blur: string;
};

/** Эргэлтийн далайц — хэлбэр бүр өөрөөр найгана. */
const SPIN: Record<ParticleShape, number> = {
  snow: 25,
  petal: 170,
  leaf: 230,
  mote: 0,
};

function shapeStyle(
  shape: ParticleShape,
  size: number,
): React.CSSProperties {
  if (shape === "petal") {
    return {
      width: `${size}px`,
      height: `${size * 0.78}px`,
      borderRadius: "70% 8% 70% 8%",
      backgroundImage:
        "linear-gradient(135deg, rgb(var(--s-ground)), var(--s-accent))",
      boxShadow: "0 0 8px rgb(var(--s-glow) / 0.45)",
    };
  }

  if (shape === "leaf") {
    return {
      width: `${size}px`,
      height: `${size * 0.6}px`,
      borderRadius: "4% 72% 4% 72%",
      backgroundImage:
        "linear-gradient(120deg, var(--s-accent), var(--s-accent-2))",
      boxShadow: "0 0 10px rgb(var(--s-glow) / 0.4)",
    };
  }

  if (shape === "mote") {
    return {
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "9999px",
      background: "var(--s-accent)",
      boxShadow: "0 0 10px rgb(var(--s-glow) / 0.8)",
    };
  }

  return {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "9999px",
    background: "rgb(var(--s-ground))",
    boxShadow: "0 0 6px rgb(var(--s-ground) / 0.75)",
  };
}

function Layer({
  layer,
  shape,
}: {
  layer: ParticleLayer;
  shape: ParticleShape;
}) {
  const random = seededRandom(layer.seed);

  return (
    <>
      {Array.from({ length: layer.count }, (_, index) => {
        const size = layer.size[0] + random() * (layer.size[1] - layer.size[0]);
        const duration =
          layer.duration[0] +
          random() * (layer.duration[1] - layer.duration[0]);
        const drift = `${1 + random() * 6}rem`;
        const sway = 2.5 + random() * 4;
        const spin = SPIN[shape];

        // Тоос, үр нь доошоо биш дээшээ хөвдөг тул нэг давхаргаар хангалттай.
        if (shape === "mote") {
          return (
            <span
              key={index}
              className={`animate-mote absolute top-0 ${layer.blur}`}
              style={
                {
                  left: `${random() * 100}%`,
                  opacity: layer.opacity,
                  animationDuration: `${duration}s`,
                  animationDelay: `-${random() * duration}s`,
                  "--drift": `${(random() * 2 - 1) * 10}rem`,
                  ...shapeStyle(shape, size),
                } as React.CSSProperties
              }
            />
          );
        }

        return (
          <span
            key={index}
            className="animate-fall absolute top-0 block"
            style={{
              left: `${random() * 100}%`,
              animationDuration: `${duration}s`,
              animationDelay: `-${random() * duration}s`,
            }}
          >
            <span
              className={`animate-flutter block ${layer.blur}`}
              style={
                {
                  opacity: layer.opacity,
                  animationDuration: `${sway}s`,
                  animationDelay: `-${random() * sway}s`,
                  "--drift": drift,
                  "--spin-from": `${-spin}deg`,
                  "--spin-to": `${spin}deg`,
                  ...shapeStyle(shape, size),
                } as React.CSSProperties
              }
            />
          </span>
        );
      })}
    </>
  );
}

/** Цас, дэлбээ, навч, цэцгийн тоос — бүгд нэг хөдөлгүүрээс. */
export function Particles({
  shape,
  layers,
}: {
  shape: ParticleShape;
  layers: ParticleLayer[];
}) {
  return (
    <div className="motion-only absolute inset-0 overflow-hidden">
      {layers.map((layer) => (
        <Layer key={layer.seed} layer={layer} shape={shape} />
      ))}
    </div>
  );
}
