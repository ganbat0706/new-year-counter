/** Дөрвөн улирлын тодорхойлолт ба огнооны тооцоо (бүгд цэвэр функц). */

export const SEASON_KEYS = ["spring", "summer", "autumn", "winter"] as const;

export type SeasonKey = (typeof SEASON_KEYS)[number];

export type Season = {
  key: SeasonKey;
  /** Товч нэр — сэлгэх товчин дээр */
  name: string;
  /** Улирал эхлэх сар (0-оос эхэлсэн индекс) */
  startMonth: number;
  /** Гарчиг ба тайлбар */
  title: string;
  tagline: string;
  /** Тоолуурын гарчигт: "<lead> хүртэл" */
  lead: string;
  /** Тоолуур дуусахад гарах мэнд */
  greeting: string;
  footer: string;
};

export const SEASONS: Record<SeasonKey, Season> = {
  spring: {
    key: "spring",
    name: "Хавар",
    startMonth: 2,
    title: "Хаврын цэцгийн үүр",
    tagline:
      "Дэлбээ салхинд хөвж, бүрэнхий тэнгэр ягаанаар будагдана. Газар дэлхий нойрноосоо сэрж байна.",
    lead: "Хавар",
    greeting: "Хаврын мэнд хүргэе!",
    footer: "Сайхан хаваржаарай",
  },
  summer: {
    key: "summer",
    name: "Зун",
    startMonth: 5,
    title: "Зуны урт наран жаргалт",
    tagline:
      "Ногоон тал нутагт наран намуухан жаргаж, өвсөн дунд галт шувууд анивчина.",
    lead: "Зун",
    greeting: "Зуны мэнд хүргэе!",
    footer: "Сайхан зусаарай",
  },
  autumn: {
    key: "autumn",
    name: "Намар",
    startMonth: 8,
    title: "Намрын алтан навчис",
    tagline:
      "Навчис алтаар шарлан эргэлдэж унана. Манан татсан хээр намар намуухан алхаж байна.",
    lead: "Намар",
    greeting: "Намрын мэнд хүргэе!",
    footer: "Сайхан намаржаарай",
  },
  winter: {
    key: "winter",
    name: "Өвөл",
    startMonth: 11,
    title: "Гацуурын ойн шөнө",
    tagline:
      "Шилмүүст ойд цас намуухан буун, туйлын гэрэл тэнгэрт долгиолно. Гэрлийн хэлхээ анивчина.",
    lead: "Өвөл",
    greeting: "Шинэ жилийн мэнд хүргэе!",
    footer: "Сайхан өвөлжөөрэй",
  },
};

/** Жагсаалтын дараалал — хаврaас эхэлнэ. */
export const SEASON_LIST: Season[] = SEASON_KEYS.map((key) => SEASONS[key]);

/** Сервер дээр анхдагчаар зурагдах улирал (inline script нь үүнийг залруулна). */
export const DEFAULT_SEASON: SeasonKey = "winter";

/** Хэрэглэгчийн сонголт хадгалагдах түлхүүр — layout-ийн script мөн үүнийг уншина. */
export const SEASON_STORAGE_KEY = "season";

export function isSeasonKey(value: unknown): value is SeasonKey {
  return (SEASON_KEYS as readonly unknown[]).includes(value);
}

/** Сарын индексээс улирлыг олно: 3–5 хавар, 6–8 зун, 9–11 намар, 12–2 өвөл. */
export function seasonOfMonth(month: number): SeasonKey {
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

/** Сар тус бүрийн улирал — layout-ийн inline script үүнээс үүсдэг. */
export const SEASON_BY_MONTH: SeasonKey[] = Array.from({ length: 12 }, (_, m) =>
  seasonOfMonth(m),
);

export function seasonOf(date: Date): SeasonKey {
  return seasonOfMonth(date.getMonth());
}

/** Дараагийн улирал (хавар → зун → намар → өвөл → хавар). */
export function nextSeason(key: SeasonKey): SeasonKey {
  const index = SEASON_KEYS.indexOf(key);
  return SEASON_KEYS[(index + 1) % SEASON_KEYS.length];
}

/** `from`-оос хойш тухайн улирал хамгийн ойрд эхлэх огноо. */
export function nextStartOf(key: SeasonKey, from: Date): Date {
  const month = SEASONS[key].startMonth;
  const candidate = new Date(from.getFullYear(), month, 1, 0, 0, 0, 0);
  if (candidate.getTime() > from.getTime()) return candidate;
  return new Date(from.getFullYear() + 1, month, 1, 0, 0, 0, 0);
}

/** Тухайн огноо багтаж буй улирлын эхлэл. */
export function currentStart(date: Date): Date {
  const month = SEASONS[seasonOf(date)].startMonth;
  const year =
    date.getMonth() < month ? date.getFullYear() - 1 : date.getFullYear();
  return new Date(year, month, 1, 0, 0, 0, 0);
}

/**
 * Тоолуурын бай. Харагдаж буй улирал нь өнөөдрийнхтэй таарч байвал
 * дараагийн улирлыг, өөр улирлыг урьдчилж үзэж байвал тэр улирлыг өөрийг нь
 * хүлээнэ — аль ч тохиолдолд "<улирал> хүртэл" гэсэн утга гарна.
 */
export function targetSeason(shown: SeasonKey, now: Date): SeasonKey {
  return shown === seasonOf(now) ? nextSeason(shown) : shown;
}

/** Одоогийн улирлын хэдэн хувь өнгөрснийг 0–1 хооронд буцаана. */
export function seasonProgress(now: Date): number {
  const start = currentStart(now).getTime();
  const end = nextStartOf(nextSeason(seasonOf(now)), now).getTime();
  return Math.min(1, Math.max(0, (now.getTime() - start) / (end - start)));
}
