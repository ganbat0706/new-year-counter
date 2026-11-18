"use client";

import { SOUND_STORAGE_KEY, type SoundPref } from "@/lib/sound";
import { useAmbience, useSoundPref } from "@/lib/useAmbience";

function apply(pref: SoundPref) {
  document.documentElement.dataset.sound = pref;
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, pref);
  } catch {
    // Хадгалах боломжгүй бол ч энэ хуудсанд ажиллана.
  }
}

/**
 * Орчны дууг асаах товч. Браузер хэрэглэгчийн товшилтгүйгээр дуу
 * тоглуулахыг хориглодог тул аудио хөдөлгүүр энэ дарлаас л үүснэ.
 */
export function SoundToggle() {
  const pref = useSoundPref();
  useAmbience();

  const on = pref === "on";

  return (
    <button
      type="button"
      onClick={() => apply(on ? "off" : "on")}
      aria-pressed={on}
      title={on ? "Орчны дууг унтраах" : "Орчны дууг асаах"}
      className="glass fixed bottom-5 right-5 z-30 flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-ink-soft transition-colors hover:text-ink sm:text-sm"
    >
      <span aria-hidden className="text-base leading-none">
        {on ? "🔊" : "🔇"}
      </span>
      {on ? "Дуу асаалттай" : "Дуу"}
    </button>
  );
}
