/**
 * Улирал бүрийн хөгжим — YouTube-ийн албан ёсны embed тоглуулагчаар.
 * Бичлэгийг солихдоо зөвхөн доорх `id`-г л өөрчилнө (бусад код хамаарахгүй).
 *
 * Бүгд албан ёсны суваг дээрх, embed зөвшөөрөгдсөн бичлэгүүд
 * (youtube.com/oembed → 200 гэж шалгасан).
 */

import type { SeasonKey } from "@/lib/seasons";

export type Track = {
  /** YouTube бичлэгийн id */
  id: string;
  title: string;
  artist: string;
};

export const TRACKS: Record<SeasonKey, Track> = {
  spring: {
    id: "KQetemT1sWc",
    title: "Here Comes The Sun",
    artist: "The Beatles",
  },
  summer: {
    // Анхны сонголт (B4iH9T__FJU, "Topic" суваг) embed дотор тоглохыг
    // хориглосон байсан — YouTube алдаа 150.
    id: "l0GN40EL1VU",
    title: "Summer (Kikujiro)",
    artist: "Joe Hisaishi",
  },
  autumn: {
    id: "XTkUplF5VIE",
    title: "Autumn Leaves",
    artist: "Eva Cassidy",
  },
  winter: {
    id: "E8gmARGvPlI",
    title: "Last Christmas",
    artist: "Wham!",
  },
};

export const MUSIC_KEYS = ["on", "off"] as const;

export type MusicPref = (typeof MUSIC_KEYS)[number];

/** Анхдагчаар унтраалттай — браузер зөвшөөрөлгүй тоглуулахыг хориглоно. */
export const DEFAULT_MUSIC: MusicPref = "off";

export const MUSIC_STORAGE_KEY = "music";

/** Чанга (0–100). Орчны дуутай зэрэг тоглоход дарж дуугарахгүйн тулд намхан. */
export const MUSIC_VOLUME = 35;

/** YouTube-ийн "энэ бичлэгийг embed дотор тоглуулж болохгүй" алдаанууд. */
export const EMBED_BLOCKED_CODES = [101, 150];

export function isMusicPref(value: unknown): value is MusicPref {
  return (MUSIC_KEYS as readonly unknown[]).includes(value);
}
