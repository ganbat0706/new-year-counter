"use client";

import { useLayoutEffect } from "react";
import {
  DAYPART_LIST,
  DAYPART_STORAGE_KEY,
  daypartOf,
  isDaypartKey,
  type DaypartKey,
} from "@/lib/dayparts";
import { useDaypart } from "@/lib/useDaypart";

function apply(daypart: DaypartKey, mode: "auto" | "manual") {
  const root = document.documentElement;
  root.dataset.daypart = daypart;
  root.dataset.daypartMode = mode;
}

function stored(): DaypartKey | null {
  try {
    const value = localStorage.getItem(DAYPART_STORAGE_KEY);
    return isDaypartKey(value) ? value : null;
  } catch {
    return null;
  }
}

export function DaypartSwitcher() {
  const daypart = useDaypart();

  // React-ийн dev remount `<html>`-ийн атрибутыг арчдаг тул сонголтыг
  // буцаан тавина. Production-д inline script аль хэдийн хийсэн байх тул
  // энэ нь юу ч өөрчлөхгүй.
  useLayoutEffect(() => {
    const saved = stored();
    apply(saved ?? daypartOf(new Date()), saved ? "manual" : "auto");
  }, []);

  function choose(next: DaypartKey) {
    try {
      localStorage.setItem(DAYPART_STORAGE_KEY, next);
    } catch {
      // Хадгалах боломжгүй бол ч сонголт энэ хуудсанд ажиллана.
    }
    apply(next, "manual");
  }

  function useAuto() {
    try {
      localStorage.removeItem(DAYPART_STORAGE_KEY);
    } catch {
      // Хоосон орхино.
    }
    apply(daypartOf(new Date()), "auto");
  }

  return (
    <nav
      aria-label="Цагийн үе сонгох"
      className="fixed inset-x-0 top-0 z-30 flex justify-center px-4 pt-[7rem] sm:pt-[4.25rem]"
    >
      <div className="glass flex items-center gap-1 rounded-full p-1 text-xs sm:gap-1.5 sm:text-sm">
        {DAYPART_LIST.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => choose(item.key)}
            aria-pressed={daypart === item.key}
            className={`pill pill-d-${item.key} cursor-pointer rounded-full border border-transparent px-3 py-1.5 font-medium text-ink-soft hover:text-ink sm:px-4`}
          >
            {item.name}
          </button>
        ))}

        <span className="mx-0.5 h-5 w-px bg-ink/15" />

        <button
          type="button"
          onClick={useAuto}
          title="Одоогийн цагаар тодорхойлох"
          className="pill pill-d-auto cursor-pointer rounded-full border border-transparent px-3 py-1.5 font-medium text-ink-soft hover:text-ink sm:px-4"
        >
          Авто
        </button>
      </div>
    </nav>
  );
}
