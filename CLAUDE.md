# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

Дөрвөн улирлын сэдэвтэй Next.js хуудас — улирал бүрийн тэнгэр дор шинэ жил
эхлэх хүртэлх хугацааг тоолно.

## Коммандууд

```bash
npm run dev     # хөгжүүлэлтийн сервер (Turbopack) → http://localhost:3000
npm run build   # production build + TypeScript шалгалт
npm run lint    # eslint (next/core-web-vitals + react-hooks)
```

Өөрчлөлт хийсний дараа заавал `npm run lint` болон `npm run build` хоёуланг
нь ажиллуул — TypeScript алдаа зөвхөн build дээр гарна.

**Тестийн хүрээ байхгүй.** `src/lib/` доторх огноо/улирлын функцүүд цэвэр
тул Node-оор шууд дуудаж шалгана (React, build шаардахгүй):

```bash
node --experimental-strip-types -e '
import("./src/lib/seasons.ts").then(({ seasonOf, seasonProgress }) =>
  console.log(seasonOf(new Date("2026-11-11")), seasonProgress(new Date("2026-11-11"))))'
```

Огнооны логик засах бүрдээ улирал бүрийн зааг (3/1, 6/1, 9/1, 12/1) ба
жил дамжих тохиолдлыг (1-р сар) ингэж шалга.

## Next.js хувилбар

Next 16 (App Router, Turbopack, Cache Components асаалттай). API нь өмнөх
хувилбаруудаас өөр байж болно — код бичихээс өмнө
`node_modules/next/dist/docs/01-app/` доторх холбогдох заавраас шалга.
`AGENTS.md` доторх `nextjs-agent-rules` блокийг `next dev` өөрөө бичдэг тул
түүнийг устгах шаардлагагүй.

## Улирлын механизм

Улирал нь `<html data-season>` атрибутаар тодорхойлогдоно. Утгыг
`layout.tsx` доторх **inline script** тавина — HTML задрах үед, зураг
гарахаас өмнө ажилладаг тул анивчилт ч, hydration зөрүү ч үүсэхгүй
(`node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`).
Script нь огноогоор улирлыг олж, `localStorage.season` байвал түүнийг
давуулна; горимыг `data-season-mode="auto" | "manual"` гэж тэмдэглэнэ.
Script-ийн сарын хүснэгт, түлхүүр, нэрс бүгд `SEASON_BY_MONTH`,
`SEASON_STORAGE_KEY`, `SEASON_KEYS`-ээс үүсдэг — **гараар бүү хуул**,
эс бөгөөс TypeScript тал өөрчлөгдөхөд script хоцорч, хуудас нэг улирлыг
зураад дараа нь нөгөө рүү үсэрнэ.

Үүний үр дүнд:

- **Бүх дэвсгэр server component хэвээр.** Зөвхөн `Countdown` ба
  `SeasonSwitcher` нь `"use client"`.
- Дөрвөн тайз зэрэг зурагдаж, идэвхгүй нь `[data-scene]` CSS-ээр
  `display:none` болно (нуугдсан давхаргын анимаци зогсдог тул ачаалал
  өгөхгүй). Үүний төлөө HTML ~900KB болдог — ширхэгийн тоог
  `Scene.tsx`-ээс тохируулж болно.
- React дотроос улирлыг унших бол `useSeason()` (`src/lib/useSeason.ts`) —
  `MutationObserver` + `useSyncExternalStore`.

## Тоолуурын логик

`Countdown.tsx` нэг зэрэг гурван өөр цагийг харуулдаг — аль нь юунаас
хамаардгийг бүү хольцолд:

| Хэсэг | Эх сурвалж | Тайлбар |
| --- | --- | --- |
| Том тоолуур | `nextNewYear(now)` | Үргэлж шинэ жил. Улирлаас хамаарахгүй. |
| Явцын судал | `seasonProgress(now)` | Үргэлж **өнөөдрийн бодит** улирал. |
| Доод мөр | `targetSeason(shown, now)` | Харагдаж буй улирлаас хамаарна. |

`targetSeason` нь: харагдаж буй улирал өнөөдрийнхтэй таарвал **дараагийн**
улирлыг, өөр улирлыг урьдчилж үзэж байвал **тэр улирлыг өөрийг нь** буцаана.
Ингэснээр аль ч тохиолдолд "<улирал> эхлэх хүртэл" гэсэн утга зөв гарна.

**Занга**: "шинэ жил боллоо" төлөвийг `left.total === 0`-оор бүү шалга.
`nextNewYear` нь 1-р сарын 1-ний 00:00:00 дээр аль хэдийн дараа жил рүү
шилждэг тул тэр нөхцөл хэзээ ч биелэхгүй. Үүнд зориулж
`newYearJustArrived()` (1-р сарын 1-ний эхний цаг) байгаа.

## Deploy (GitHub Pages)

`main` руу push хийх бүрт `.github/workflows/deploy.yml` нь lint → build →
Pages deploy хийнэ → https://ganbat0706.github.io/new-year-counter/

Pages-ийн build нь `GITHUB_PAGES=1`-тэй ажилладаг. Энэ үед `next.config.ts`
нь `output: "export"` ба `basePath: "/new-year-counter"`-г асааж, **PPR-ийг
(`cacheComponents`, `partialPrefetching`) унтраана** — PPR нь export горимд
ажиллахгүй (`Invariant: PPR cannot be enabled in export mode`). Локал `npm run
dev` / `npm run build` дээр PPR хэвээр асаалттай. Иймд серверийн шинж чанар
(dynamic route, server action, ISR) нэмбэл Pages-ийн build унана — тэр
тохиолдолд өөр хостинг руу шилжүүлэх шаардлагатай.

## Бүтэц

- `src/app/layout.tsx` — root layout, улирлын inline script, `Sora` →
  `--font-display`, `Inter` → `--font-sans`.
- `src/app/page.tsx` — цорын ганц хуудас: `Scene`, `SeasonSwitcher`,
  улирал тус бүрийн гарчиг, `Countdown`.
- `src/app/globals.css` — Tailwind v4.
  - Улирлын палитр `[data-season="..."]` блок бүрт `--s-*` хувьсагчаар.
  - `@theme inline` нь `--color-accent` гэх мэтийг `var(--s-accent)`
    хэвээр гаргадаг тул улирал солигдоход Tailwind класс бүр шууд дагана.
    **Өнгийг `@theme`-д шууд бичиж болохгүй** — тэгвэл утга нь хуулагдаж,
    улирал дагахаа болино.
  - Анимаци: `@keyframes` + `@theme`-д `--animate-*` хосоор нэмнэ.
- `src/components/Scene.tsx` — дөрвөн тайзыг нэгтгэнэ. Ширхэг, мод,
  өвсний тоо энд тохирогдоно.
- `src/components/scene/` — дэвсгэрийн эд ангиуд, бүгд улирал хамаарахгүй
  ерөнхий болгож бичигдсэн:
  - `Sky` — дөрвөн тэнгэр давхарлан, зөвхөн `opacity`-гоор сольцдог
  - `Celestial` — `Sun`, `Moon`, `Stars`, `ShootingStars`, `Aurora`
  - `Weather` — `Clouds`, `Mist`
  - `Wildlife` — `Birds`, `Butterflies`
  - `Trees` — `Forest` (pine/blossom/leafy/bare), `Hills`, `Grass`, `Ground`
  - `Particles` — цас/дэлбээ/навч/тоос нэг хөдөлгүүрээс
  - `Orbs` — bokeh толбо ба галт шувуу
  - `Garland` — зөвхөн өвөлд. Унжилт нь `bulbPosition()` ба `wirePath()`
    гэсэн нэг томъёоноос гардаг — аль нэгийг өөрчилвөл нөгөөг нь мөн засна.
- `src/lib/useSeason.ts` — идэвхтэй улирлыг DOM-оос уншдаг hook.
- `src/lib/seasons.ts` — улирлын тодорхойлолт ба огнооны тооцоо.
- `src/lib/countdown.ts` — шинэ жил хүртэлх хугацаа.
- `src/lib/random.ts` — seeded random.

## Тогтсон зарчмууд

- **Hydration**: бүх дэвсгэрийн элементийн байрлал `seededRandom(seed)`-оос
  гарна. `Math.random()` битгий хэрэглэ — сервер ба клиент дээр өөр утга
  гарч hydration зөрнө.
- **Цаг**: клиент дээрх цагийг `useSyncExternalStore`-оор уншина
  (`Countdown.tsx`). `useEffect` дотроос `setState` дуудвал
  `react-hooks/set-state-in-effect` lint алдаа өгнө.
- **Анимаци**: унах ширхэгүүд хоёр давхар элементтэй — гадна нь босоо
  уналт (`animate-fall`), дотор нь найгалт/эргэлт (`animate-flutter`).
  Ингэснээр хөдөлгөөн механик биш, салхитай мэт болно.
  `prefers-reduced-motion` хамгаалалт globals.css-д аль хэдийн бий.
- **Хөдөлгөөнгүй горим**: унах/нисэх давхаргууд `fill-mode`-гүй тул
  анимаци зогсоход суурь байрлалдаа овоорч хураагддаг. Иймд цас, дэлбээ,
  навч, үүл, шувуу, эрвээхэй, гулсах одны сав бүр дээр `motion-only`
  класс өгнө — `prefers-reduced-motion` үед CSS нь бүрэн нууна. Шинэ
  хөдөлгөөнт давхарга нэмэх бүрдээ энэ классыг бас өг.
- **Текст** хэрэглэгчид харагдах бүх мөр монгол хэл дээр. Код доторх
  тайлбар мөн монголоор.
- Дэвсгэр `-z-30` (Sky) / `-z-20` (тайзууд) дээр `fixed`-ээр сууна;
  контент `relative z-10`, гэрлийн хэлхээ `z-20`, сэлгэх товчнууд `z-30`.
