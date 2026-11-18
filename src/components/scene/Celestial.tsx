import { seededRandom } from "@/lib/random";

/** Шөнийн сар — тогоотой, эргэн тойрондоо туяатай. */
export function Moon() {
  return (
    <div className="absolute right-[12%] top-[9%] h-20 w-20 sm:right-[16%]">
      <div
        className="animate-halo absolute -inset-14 rounded-full blur-2xl"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgb(var(--s-ground) / 0.45), transparent 68%)",
        }}
      />
      <div className="animate-float relative h-full w-full rounded-full bg-ground/95 shadow-[0_0_70px_-10px_rgb(var(--s-ground)/0.8)]">
        <span className="absolute left-[24%] top-[28%] h-3 w-3 rounded-full bg-near/15" />
        <span className="absolute left-[55%] top-[52%] h-4 w-4 rounded-full bg-near/12" />
        <span className="absolute left-[32%] top-[64%] h-2 w-2 rounded-full bg-near/15" />
      </div>
    </div>
  );
}

/**
 * Нар — эргэлдэх туяа, цохилох сүүлэг, дискнээс бүрдэнэ.
 * `x`/`y` нь хувиар өгөгдөнө.
 */
export function Sun({ x, y, size }: { x: string; y: string; size: number }) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        width: `${size}vh`,
        height: `${size}vh`,
        marginLeft: `${-size / 2}vh`,
      }}
    >
      {/* Эргэлдэх туяанууд */}
      <div
        className="animate-rays absolute"
        style={{
          inset: `${-size * 2}vh`,
          backgroundImage:
            "repeating-conic-gradient(from 0deg, rgb(var(--s-glow) / 0.18) 0deg 2.5deg, transparent 2.5deg 13deg)",
          maskImage:
            "radial-gradient(circle, rgb(0 0 0 / 0.9) 12%, transparent 62%)",
        }}
      />
      {/* Зөөлөн сүүлэг */}
      <div
        className="animate-halo absolute rounded-full blur-2xl"
        style={{
          inset: `${-size * 0.75}vh`,
          backgroundImage:
            "radial-gradient(circle, rgb(var(--s-glow) / 0.65), transparent 70%)",
        }}
      />
      <div
        className="animate-breathe relative h-full w-full rounded-full"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 42%, #fffdf3, rgb(var(--s-glow)) 62%, rgb(var(--s-glow) / 0.1) 100%)",
        }}
      />
    </div>
  );
}

/** Анивчих одод — байрлал нь seed-ээс гардаг тул hydration зөрөхгүй. */
export function Stars({ seed, count }: { seed: number; count: number }) {
  const random = seededRandom(seed);

  return (
    <div className="absolute inset-x-0 top-0 h-[70vh]">
      {Array.from({ length: count }, (_, index) => {
        const size = 1 + random() * 2.4;
        const duration = 2.5 + random() * 5;

        return (
          <span
            key={index}
            className="animate-twinkle absolute rounded-full bg-ground"
            style={{
              left: `${random() * 100}%`,
              top: `${random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDuration: `${duration}s`,
              animationDelay: `-${random() * duration}s`,
              boxShadow: `0 0 ${size * 3}px rgb(var(--s-ground) / 0.9)`,
            }}
          />
        );
      })}
    </div>
  );
}

/** Хааяа нэг гулсан өнгөрөх од. */
export function ShootingStars() {
  return (
    <>
      {[
        { top: "12%", left: "8%", duration: 17, delay: 0 },
        { top: "22%", left: "38%", duration: 23, delay: -9 },
      ].map((star) => (
        <span
          key={star.left}
          className="motion-only animate-shoot absolute h-px w-24 rounded-full bg-gradient-to-r from-transparent via-ground to-transparent"
          style={{
            top: star.top,
            left: star.left,
            rotate: "28deg",
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </>
  );
}

/** Туйлын гэрэл — гурван давхарга долгиолж сольцоно. */
export function Aurora() {
  const BANDS = [
    { top: "2%", height: "34vh", duration: 16, delay: 0, hue: "var(--s-accent-2)" },
    { top: "8%", height: "28vh", duration: 21, delay: -7, hue: "var(--s-accent)" },
    { top: "0%", height: "40vh", duration: 27, delay: -13, hue: "var(--s-accent-2)" },
  ];

  return (
    <div className="absolute inset-x-0 top-0 h-[45vh] overflow-hidden blur-2xl">
      {BANDS.map((band) => (
        <div
          key={band.duration}
          className="animate-aurora absolute inset-x-[-15%]"
          style={{
            top: band.top,
            height: band.height,
            animationDuration: `${band.duration}s`,
            animationDelay: `${band.delay}s`,
            backgroundImage: `linear-gradient(to bottom, transparent, color-mix(in oklab, ${band.hue} 55%, transparent) 45%, transparent)`,
          }}
        />
      ))}
    </div>
  );
}
