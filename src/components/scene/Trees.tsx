import { seededRandom } from "@/lib/random";

export type TreeShape = "pine" | "blossom" | "leafy" | "bare";

/** Мөчир/навчны бүрхүүл. Силуэт ба өнгөт тод давхарга хоёулаа үүнийг зурна. */
function Canopy({ shape }: { shape: TreeShape }) {
  if (shape === "pine") {
    return (
      <>
        <polygon points="50,2 76,58 24,58" />
        <polygon points="50,36 86,104 14,104" />
        <polygon points="50,74 97,152 3,152" />
      </>
    );
  }

  if (shape === "blossom") {
    return (
      <>
        <circle cx="50" cy="34" r="21" />
        <circle cx="30" cy="54" r="24" />
        <circle cx="68" cy="48" r="23" />
        <circle cx="72" cy="72" r="17" />
        <circle cx="28" cy="76" r="16" />
        <circle cx="50" cy="62" r="22" />
      </>
    );
  }

  if (shape === "leafy") {
    return (
      <>
        <circle cx="50" cy="38" r="26" />
        <circle cx="26" cy="64" r="23" />
        <circle cx="74" cy="62" r="24" />
        <circle cx="50" cy="66" r="28" />
      </>
    );
  }

  return null;
}

/** Их бие — нүцгэн мод дээр мөчир нь мөн энд багтана. */
function Trunk({ shape }: { shape: TreeShape }) {
  if (shape === "pine") {
    return <rect x="45" y="138" width="10" height="27" rx="2" />;
  }

  if (shape === "bare") {
    return (
      <path
        d="M44 165 L44 104 L30 74 M44 118 L62 92 M44 134 L26 108 M46 104 L46 70 L60 44 M46 86 L30 58 M46 70 L54 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    );
  }

  return (
    <path d="M44 165 L44 92 Q 42 76 30 66 Q 44 72 45 88 L46 78 Q 52 62 66 54 Q 53 66 52 84 L56 165 Z" />
  );
}

function Tree({
  shape,
  tint,
  className,
  style,
}: {
  shape: TreeShape;
  tint: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 100 165"
      fill="currentColor"
      aria-hidden
      className={className}
      style={style}
      preserveAspectRatio="xMidYMax meet"
    >
      <Trunk shape={shape} />
      <Canopy shape={shape} />
      {tint > 0 ? (
        <g fill="var(--s-accent)" opacity={tint}>
          <Canopy shape={shape} />
        </g>
      ) : null}
    </svg>
  );
}

export type TreeLayer = {
  seed: number;
  count: number;
  shape: TreeShape;
  /** Модны өндөр vh-ээр: [доод, дээд] */
  height: [number, number];
  /** Силуэтийн өнгө (Tailwind класс) */
  color: string;
  /** Навчны дээр нэмэх улирлын өнгөний хэмжээ, 0–1 */
  tint: number;
  blur: string;
  /** Доод ирмэгээс хэр өндөрт зогсох вэ */
  bottom: string;
};

function TreeLine({ layer }: { layer: TreeLayer }) {
  const random = seededRandom(layer.seed);

  return (
    <div className={`absolute inset-x-0 ${layer.bottom} ${layer.color}`}>
      {Array.from({ length: layer.count }, (_, index) => {
        const height =
          layer.height[0] + random() * (layer.height[1] - layer.height[0]);
        // Модуудыг давхарга дотор жигд тарааж, бага зэрэг хаялбарлана.
        const slot = (index + 0.5) / layer.count;
        const jitter = (random() * 2 - 1) * (40 / layer.count);
        const width = height * (layer.shape === "pine" ? 0.62 : 0.78);

        return (
          <Tree
            key={index}
            shape={layer.shape}
            tint={layer.tint}
            className={`animate-sway absolute bottom-0 origin-bottom ${layer.blur}`}
            style={{
              left: `${slot * 100 + jitter}%`,
              height: `${height}vh`,
              width: `${width}vh`,
              marginLeft: `${-width / 2}vh`,
              animationDuration: `${7 + random() * 6}s`,
              animationDelay: `-${random() * 9}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export function Forest({ layers }: { layers: TreeLayer[] }) {
  return (
    <>
      {layers.map((layer) => (
        <TreeLine key={layer.seed} layer={layer} />
      ))}
    </>
  );
}

/** Алсын толгод — гурван давхарга агаарын перспективээр. */
export function Hills() {
  const LAYERS = [
    { color: "text-far", bottom: "9vh", height: "26vh", opacity: 0.75, path: "M0 140 Q 140 70 310 118 T 640 100 T 1000 136 L1000 200 L0 200Z" },
    { color: "text-mid", bottom: "4vh", height: "24vh", opacity: 0.9, path: "M0 150 Q 190 96 360 140 T 700 124 T 1000 152 L1000 200 L0 200Z" },
    { color: "text-near", bottom: "0", height: "20vh", opacity: 1, path: "M0 160 Q 160 126 330 156 T 690 146 T 1000 166 L1000 200 L0 200Z" },
  ];

  return (
    <>
      {LAYERS.map((layer) => (
        <svg
          key={layer.bottom}
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
          aria-hidden
          className={`absolute inset-x-0 w-full ${layer.color}`}
          style={{ bottom: layer.bottom, height: layer.height, opacity: layer.opacity }}
        >
          <path d={layer.path} fill="currentColor" />
        </svg>
      ))}
    </>
  );
}

/** Хамгийн урд талын өвс — салхинд найгана. */
export function Grass({ seed, count }: { seed: number; count: number }) {
  const random = seededRandom(seed);

  return (
    <div className="absolute inset-x-0 bottom-0 h-[14vh] text-near">
      {Array.from({ length: count }, (_, index) => {
        const height = 4 + random() * 8;
        const duration = 3.5 + random() * 3.5;

        return (
          <span
            key={index}
            className="animate-grass absolute bottom-0 origin-bottom rounded-t-full bg-current"
            style={{
              left: `${(index + random()) * (100 / count)}%`,
              width: `${0.5 + random() * 0.7}vh`,
              height: `${height}vh`,
              rotate: `${(random() * 2 - 1) * 8}deg`,
              animationDuration: `${duration}s`,
              animationDelay: `-${random() * duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}

/** Доод ирмэгийн газар — цасан хунгар, ногоон тал, унасан навч бүгд үүгээр. */
export function Ground({ height = "16vh" }: { height?: string }) {
  return (
    <div
      className="absolute inset-x-0 bottom-0"
      style={{
        height,
        backgroundImage:
          "linear-gradient(to top, rgb(var(--s-ground) / 0.26), rgb(var(--s-ground) / 0.07) 45%, transparent)",
      }}
    />
  );
}
