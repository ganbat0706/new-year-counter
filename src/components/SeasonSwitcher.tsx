"use client";

import { useLayoutEffect } from "react";
import {
  SEASON_LIST,
  SEASON_STORAGE_KEY,
  isSeasonKey,
  seasonOf,
  type SeasonKey,
} from "@/lib/seasons";
import { useSeason } from "@/lib/useSeason";

function apply(season: SeasonKey, mode: "auto" | "manual") {
  const root = document.documentElement;
  root.dataset.season = season;
  root.dataset.seasonMode = mode;
}

function stored(): SeasonKey | null {
  try {
    const value = localStorage.getItem(SEASON_STORAGE_KEY);
    return isSeasonKey(value) ? value : null;
  } catch {
    return null;
  }
}

export function SeasonSwitcher() {
  const season = useSeason();

  // React-ийн dev remount `<html>`-ийн атрибутыг арчдаг тул сонголтыг
  // буцаан тавина. Production-д inline script аль хэдийн хийсэн байх тул
  // энэ нь юу ч өөрчлөхгүй.
  useLayoutEffect(() => {
    const saved = stored();
    apply(saved ?? seasonOf(new Date()), saved ? "manual" : "auto");
  }, []);

  function choose(next: SeasonKey) {
    try {
      localStorage.setItem(SEASON_STORAGE_KEY, next);
    } catch {
      // Хадгалах боломжгүй бол ч сонголт энэ хуудсанд ажиллана.
    }
    apply(next, "manual");
  }

  function useAuto() {
    try {
      localStorage.removeItem(SEASON_STORAGE_KEY);
    } catch {
      // Хоосон орхино.
    }
    apply(seasonOf(new Date()), "auto");
  }

  return (
    <nav
      aria-label="Улирал сонгох"
      className="pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-center px-4 pt-16 sm:pt-6"
    >
      <div className="glass pointer-events-auto flex items-center gap-1 rounded-full p-1 text-xs sm:gap-1.5 sm:text-sm">
        {SEASON_LIST.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => choose(item.key)}
            aria-pressed={season === item.key}
            className={`pill pill-${item.key} cursor-pointer rounded-full border border-transparent px-3 py-1.5 font-medium text-ink-soft hover:text-ink sm:px-4`}
          >
            {item.name}
          </button>
        ))}

        <span className="mx-0.5 h-5 w-px bg-ink/15" />

        <button
          type="button"
          onClick={useAuto}
          title="Өнөөдрийн огноогоор тодорхойлох"
          className="pill pill-auto cursor-pointer rounded-full border border-transparent px-3 py-1.5 font-medium text-ink-soft hover:text-ink sm:px-4"
        >
          Авто
        </button>
      </div>
    </nav>
  );
}
