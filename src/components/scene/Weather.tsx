import { seededRandom } from "@/lib/random";

/** Нэг үүл — гурван бөөрөнхий толбын давхцлаас бүрдэнэ. */
function Cloud({ width, tone }: { width: number; tone: string }) {
  return (
    <div
      className="relative blur-[6px]"
      style={{ width: `${width}px`, height: `${width * 0.3}px` }}
    >
      <span
        className="absolute bottom-0 left-0 h-[55%] w-full rounded-full"
        style={{ background: tone }}
      />
      <span
        className="absolute bottom-[20%] left-[14%] h-[90%] w-[46%] rounded-full"
        style={{ background: tone }}
      />
      <span
        className="absolute bottom-[12%] left-[50%] h-[70%] w-[38%] rounded-full"
        style={{ background: tone }}
      />
    </div>
  );
}

/** Хэвтээгээр намуухан хөвөх үүлс. */
export function Clouds({
  seed,
  count,
  tone,
}: {
  seed: number;
  count: number;
  tone: string;
}) {
  const random = seededRandom(seed);

  return (
    <div className="motion-only absolute inset-x-0 top-0 h-[55vh] overflow-hidden">
      {Array.from({ length: count }, (_, index) => {
        const width = 140 + random() * 260;
        const duration = 90 + random() * 120;

        return (
          <div
            key={index}
            className="animate-cloud absolute left-0"
            style={{
              top: `${4 + random() * 60}%`,
              opacity: 0.2 + random() * 0.4,
              animationDuration: `${duration}s`,
              animationDelay: `-${random() * duration}s`,
            }}
          >
            <Cloud width={width} tone={tone} />
          </div>
        );
      })}
    </div>
  );
}

/** Намрын хөндийд хэвтэх манангийн судлууд. */
export function Mist({ seed, count }: { seed: number; count: number }) {
  const random = seededRandom(seed);

  return (
    <div className="absolute inset-x-0 bottom-0 h-[40vh] overflow-hidden">
      {Array.from({ length: count }, (_, index) => {
        const duration = 24 + random() * 26;

        return (
          <div
            key={index}
            className="animate-mist absolute inset-x-[-10%] blur-xl"
            style={{
              bottom: `${3 + index * 7 + random() * 4}vh`,
              height: `${4 + random() * 7}vh`,
              animationDuration: `${duration}s`,
              animationDelay: `-${random() * duration}s`,
              backgroundImage:
                "linear-gradient(to right, transparent, rgb(var(--s-ground) / 0.3) 25%, rgb(var(--s-ground) / 0.45) 55%, transparent)",
            }}
          />
        );
      })}
    </div>
  );
}
