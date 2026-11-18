"use client";

import { useSyncExternalStore } from "react";
import {
  newYearJustArrived,
  nextNewYear,
  pad,
  timeLeftUntil,
  type TimeLeft,
} from "@/lib/countdown";
import {
  SEASONS,
  nextStartOf,
  seasonOf,
  seasonProgress,
  targetSeason,
  type SeasonKey,
} from "@/lib/seasons";
import { useSeason } from "@/lib/useSeason";

const UNITS = [
  { key: "days", label: "Өдөр" },
  { key: "hours", label: "Цаг" },
  { key: "minutes", label: "Минут" },
  { key: "seconds", label: "Секунд" },
] as const;

/** Секунд тутам сэрээдэг цагийн "store" — 1 секундын нарийвчлалтай snapshot. */
function subscribe(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 250);
  return () => window.clearInterval(id);
}

const getSnapshot = () => Math.floor(Date.now() / 1000);

/** Сервер дээр цаг мэдэгдэхгүй — hydration-ы дараа л дүүргэнэ. */
const getServerSnapshot = () => null;

/** Тоо солигдох бүрт `key` шинэчлэгдэж, `animate-tick` дахин эхэлнэ. */
function Unit({
  label,
  value,
  delay,
}: {
  label: string;
  value: number | null;
  delay: number;
}) {
  return (
    <div
      className="glass animate-rise flex flex-col items-center gap-2 rounded-3xl px-4 py-6 sm:py-8"
      style={{ animationDelay: `${delay}ms`, perspective: "700px" }}
    >
      <span className="font-display text-4xl font-semibold tabular-nums text-ink drop-shadow-[0_0_18px_rgb(var(--s-glow)/0.55)] sm:text-6xl">
        {value === null ? (
          "––"
        ) : (
          <span key={value} className="animate-tick inline-block">
            {pad(value)}
          </span>
        )}
      </span>
      <span className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-accent/80 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

/** Одоогийн улирал хэдэн хувь өнгөрснийг харуулах судал. */
function Progress({ now }: { now: Date | null }) {
  const percent = now === null ? 0 : Math.round(seasonProgress(now) * 100);
  const name = now === null ? "" : SEASONS[seasonOf(now)].name;

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <div className="flex items-baseline justify-between text-xs tracking-wide text-ink-soft/80">
        <span>
          {now === null ? "Улирлын явц" : `Өнөөдөр: ${name} улирлын явц`}
        </span>
        <span className="tabular-nums text-accent">{percent}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
        <div
          className="animate-sheen h-full rounded-full transition-[width] duration-1000 ease-out"
          style={{
            width: `${percent}%`,
            backgroundImage:
              "linear-gradient(100deg, var(--s-accent-2), var(--s-accent) 45%, rgb(var(--s-ground)) 60%, var(--s-accent) 75%)",
            backgroundSize: "220% 100%",
          }}
        />
      </div>
    </div>
  );
}

/** Туслах мөр — дараагийн улирал хэзээ эхлэхийг хэлнэ. */
function SeasonNote({ now, shown }: { now: Date | null; shown: SeasonKey }) {
  if (now === null) return null;

  const season = targetSeason(shown, now);
  const left = timeLeftUntil(nextStartOf(season, now), now);

  return (
    <p className="text-center text-xs tracking-wide text-ink-soft/70">
      {SEASONS[season].lead} эхлэх хүртэл{" "}
      <span className="tabular-nums text-accent">
        {left.days} өдөр {pad(left.hours)}:{pad(left.minutes)}:
        {pad(left.seconds)}
      </span>
    </p>
  );
}

export function Countdown() {
  const nowSeconds = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const shown = useSeason();

  const now = nowSeconds === null ? null : new Date(nowSeconds * 1000);
  const target = now === null ? null : nextNewYear(now);
  const left: TimeLeft | null =
    now === null || target === null ? null : timeLeftUntil(target, now);
  const arrived = now !== null && newYearJustArrived(now);

  return (
    <section className="flex w-full flex-col items-center gap-8">
      <p className="sr-only" aria-live="polite">
        {arrived
          ? SEASONS.winter.greeting
          : left === null
            ? ""
            : `Шинэ жил хүртэл ${left.days} өдөр ${left.hours} цаг`}
      </p>

      <p className="text-center text-sm font-medium uppercase tracking-[0.35em] text-accent/90">
        {arrived ? "Шинэ жил эхэллээ" : "Шинэ жил хүртэл"}
        {target !== null && !arrived ? ` · ${target.getFullYear()}` : ""}
      </p>

      {arrived ? (
        <p className="sheen-text animate-sheen font-display text-center text-5xl font-semibold sm:text-7xl">
          {SEASONS.winter.greeting}
        </p>
      ) : (
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
          {UNITS.map(({ key, label }, index) => (
            <Unit
              key={key}
              label={label}
              value={left === null ? null : left[key]}
              delay={index * 90}
            />
          ))}
        </div>
      )}

      <Progress now={now} />

      <SeasonNote now={now} shown={shown} />
    </section>
  );
}
