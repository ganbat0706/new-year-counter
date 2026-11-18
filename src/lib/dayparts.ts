/** Хоногийн дөрвөн үе ба цагийн тооцоо (бүгд цэвэр функц). */

export const DAYPART_KEYS = ["dawn", "day", "dusk", "night"] as const;

export type DaypartKey = (typeof DAYPART_KEYS)[number];

export type Daypart = {
  key: DaypartKey;
  /** Товч нэр — сэлгэх товчин дээр */
  name: string;
  /** Үе эхлэх цаг (0–23) */
  startHour: number;
};

export const DAYPARTS: Record<DaypartKey, Daypart> = {
  dawn: { key: "dawn", name: "Үүр", startHour: 5 },
  day: { key: "day", name: "Өдөр", startHour: 8 },
  dusk: { key: "dusk", name: "Бүрий", startHour: 17 },
  night: { key: "night", name: "Шөнө", startHour: 20 },
};

/** Жагсаалтын дараалал — үүрээс эхэлнэ. */
export const DAYPART_LIST: Daypart[] = DAYPART_KEYS.map((key) => DAYPARTS[key]);

/** Сервер дээр анхдагчаар зурагдах үе (inline script нь үүнийг залруулна). */
export const DEFAULT_DAYPART: DaypartKey = "night";

/** Хэрэглэгчийн сонголт хадгалагдах түлхүүр — layout-ийн script мөн үүнийг уншина. */
export const DAYPART_STORAGE_KEY = "daypart";

export function isDaypartKey(value: unknown): value is DaypartKey {
  return (DAYPART_KEYS as readonly unknown[]).includes(value);
}

/** Цагаас үеийг олно: 5–7 үүр, 8–16 өдөр, 17–19 бүрий, 20–4 шөнө. */
export function daypartOfHour(hour: number): DaypartKey {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}

/** Цаг тус бүрийн үе — layout-ийн inline script үүнээс үүсдэг. */
export const DAYPART_BY_HOUR: DaypartKey[] = Array.from({ length: 24 }, (_, h) =>
  daypartOfHour(h),
);

export function daypartOf(date: Date): DaypartKey {
  return daypartOfHour(date.getHours());
}
