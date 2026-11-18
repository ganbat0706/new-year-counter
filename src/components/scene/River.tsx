import { seededRandom } from "@/lib/random";

/**
 * Газрын ирмэг дагуух гол. Гурван долгионы давхарга өөр өөр хурдаар
 * гулсаж урсгалын мэдрэмж өгнө; гадаргуу дээр нар/сарны тусгал тусна.
 *
 * Өвөлд (`[data-season="winter"]`) урсгал зогсож, мөсөн гадаргуу болно —
 * үүнийг бүхэлд нь globals.css шийднэ, JS шалгалт байхгүй.
 */
export function River({
  seed,
  bottom,
  height = "9vh",
}: {
  seed: number;
  bottom: string;
  height?: string;
}) {
  const random = seededRandom(seed);

  // Долгионы давхаргууд — хол нь нарийн, бүдэг, удаан.
  const bands = [
    { top: "6%", h: "26%", duration: 19, opacity: 0.3, size: 180 },
    { top: "34%", h: "30%", duration: 13, opacity: 0.42, size: 130 },
    { top: "64%", h: "34%", duration: 8.5, opacity: 0.55, size: 90 },
  ];

  return (
    <div
      className="river absolute inset-x-0 overflow-hidden"
      style={{ bottom, height }}
    >
      {/* Усны суурь — улирлын палитраас өнгөө авна */}
      <div className="river-bed absolute inset-0" />

      {/* Нар/сарны тусгал — шөнө сулхан, өдөр тод */}
      <div className="river-sheen absolute inset-0" />

      {bands.map((band, index) => (
        <div
          key={band.duration}
          className="river-flow motion-only absolute inset-x-[-60%]"
          style={{
            top: band.top,
            height: band.h,
            opacity: band.opacity,
            animationDuration: `${band.duration}s`,
            animationDirection: index % 2 ? "reverse" : "normal",
            animationDelay: `-${random() * band.duration}s`,
            backgroundImage: `repeating-linear-gradient(
              104deg,
              transparent 0px,
              rgb(var(--s-ground) / 0.5) ${1 + random() * 1.5}px,
              transparent ${4 + random() * 4}px,
              transparent ${band.size}px
            )`,
          }}
        />
      ))}

      {/* Өвлийн мөс — зөвхөн `[data-season="winter"]` үед ил болно */}
      <div className="river-ice absolute inset-0" />

      {/* Эрэг — усыг газраас тусгаарлана */}
      <div className="river-bank absolute inset-x-0 top-0 h-[8%]" />
    </div>
  );
}
