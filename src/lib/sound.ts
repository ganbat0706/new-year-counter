/** Дууны горим — улирал, цагийн үетэй ижил зарчмаар `<html data-sound>`-д сууна. */

export const SOUND_KEYS = ["on", "off"] as const;

export type SoundPref = (typeof SOUND_KEYS)[number];

/** Анхдагчаар дуугүй: браузер зөвшөөрөлгүй тоглуулахыг хориглодог ба
 *  хэрэглэгчийг гэнэт цочоохгүйн тулд. */
export const DEFAULT_SOUND: SoundPref = "off";

export const SOUND_STORAGE_KEY = "sound";

export function isSoundPref(value: unknown): value is SoundPref {
  return (SOUND_KEYS as readonly unknown[]).includes(value);
}
