import { useSyncExternalStore } from "react";
import {
  DEFAULT_DAYPART,
  isDaypartKey,
  type DaypartKey,
} from "@/lib/dayparts";

/** `<html data-daypart>`-ийг ажиглах store — утгыг layout-ийн inline script тавина. */
function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-daypart"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): DaypartKey {
  const value = document.documentElement.dataset.daypart;
  return isDaypartKey(value) ? value : DEFAULT_DAYPART;
}

/** Сервер дээрх HTML-д бичигдсэн утга — hydration энэнээс эхэлнэ. */
function getServerSnapshot(): DaypartKey {
  return DEFAULT_DAYPART;
}

/** Идэвхтэй цагийн үеийг DOM-оос уншина (useEffect-гүй, hydration-д аюулгүй). */
export function useDaypart(): DaypartKey {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
