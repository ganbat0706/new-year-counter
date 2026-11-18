/**
 * Дөрвөн улирлын тэнгэр — дөрвүүлээ зэрэг зурагдаж, зөвхөн ил тодоороо
 * сольцдог тул улирал солиход хатуу таслалт биш, зөөлөн шилжилт болно.
 */
export function Sky() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-30 overflow-hidden"
    >
      <div className="sky sky-spring" />
      <div className="sky sky-summer" />
      <div className="sky sky-autumn" />
      <div className="sky sky-winter" />

      {/* Цагийн үеийн аяс — дөрвөн тэнгэрийн дээгүүр нэг давхарга */}
      <div className="daypart-wash absolute inset-0" />

      {/* Тэнгэрийн хаяанаас цацрах дулаан туяа */}
      <div
        className="animate-breathe absolute inset-x-0 bottom-0 h-[55vh]"
        style={{
          backgroundImage:
            "radial-gradient(60% 100% at 50% 100%, rgb(var(--s-glow) / 0.34), transparent 72%)",
        }}
      />

      {/* Булангийн сүүдэрлэлт — голд анхаарлыг татна */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(125% 85% at 50% 42%, transparent 38%, rgb(0 0 0 / 0.5) 100%)",
        }}
      />
    </div>
  );
}
