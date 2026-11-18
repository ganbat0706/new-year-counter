import { useSyncExternalStore } from "react";
import { DEFAULT_SEASON, isSeasonKey, type SeasonKey } from "@/lib/seasons";

/** `<html data-season>`-ийг ажиглах store — утгыг layout-ийн inline script тавина. */
function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-season"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): SeasonKey {
  const value = document.documentElement.dataset.season;
  return isSeasonKey(value) ? value : DEFAULT_SEASON;
}

/** Сервер дээрх HTML-д бичигдсэн утга — hydration энэнээс эхэлнэ. */
function getServerSnapshot(): SeasonKey {
  return DEFAULT_SEASON;
}

/** Идэвхтэй улирлыг DOM-оос уншина (useEffect-гүй, hydration-д аюулгүй). */
export function useSeason(): SeasonKey {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
