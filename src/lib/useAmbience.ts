import { useEffect, useRef, useSyncExternalStore } from "react";
import { createAmbience, mixFor } from "@/lib/ambience";
import { useDaypart } from "@/lib/useDaypart";
import { DEFAULT_SOUND, isSoundPref, type SoundPref } from "@/lib/sound";
import { useSeason } from "@/lib/useSeason";

/** `<html data-sound>`-ийг ажиглах store — улирал, цагийн үетэй ижил загвар. */
function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-sound"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): SoundPref {
  const value = document.documentElement.dataset.sound;
  return isSoundPref(value) ? value : DEFAULT_SOUND;
}

function getServerSnapshot(): SoundPref {
  return DEFAULT_SOUND;
}

/** Дууны горимыг DOM-оос уншина. */
export function useSoundPref(): SoundPref {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Орчны дууг асаах/унтраах ба улирал, цагийн үеэр найруулга солих.
 * Аудио хөдөлгүүр нь зөвхөн дуу асаалттай үед л үүснэ.
 */
export function useAmbience(): void {
  const pref = useSoundPref();
  const season = useSeason();
  const daypart = useDaypart();
  const engine = useRef<ReturnType<typeof createAmbience>>(null);

  useEffect(() => {
    if (pref !== "on") return;

    engine.current ??= createAmbience();

    // Хуудас шинээр нээгдэхэд браузер аудиог түр зогсоосон байж болно —
    // хэрэглэгчийн анхны товшилтод сэргээнэ.
    const resume = () => engine.current?.setMix(mixFor(season, daypart));
    document.addEventListener("pointerdown", resume, { once: true });

    return () => {
      document.removeEventListener("pointerdown", resume);
      engine.current?.stop();
      engine.current = null;
    };
    // `season`/`daypart` нь зөвхөн сэргээх дуудлагад хэрэгтэй — доорх
    // effect найруулгыг тусад нь шинэчилнэ.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pref]);

  useEffect(() => {
    if (pref !== "on") return;
    engine.current?.setMix(mixFor(season, daypart));
  }, [pref, season, daypart]);
}
