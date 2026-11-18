"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  DEFAULT_MUSIC,
  EMBED_BLOCKED_CODES,
  MUSIC_STORAGE_KEY,
  MUSIC_VOLUME,
  TRACKS,
  isMusicPref,
  type MusicPref,
} from "@/lib/music";
import type { SeasonKey } from "@/lib/seasons";
import { useSeason } from "@/lib/useSeason";

/* YouTube IFrame API-ийн хэрэгтэй хэсгийн тодорхойлолт — багц нэмэхгүйн тулд. */
type YtPlayer = {
  loadVideoById: (id: string) => void;
  setVolume: (value: number) => void;
  playVideo: () => void;
  destroy: () => void;
};

type YtApi = {
  Player: new (
    el: HTMLElement,
    options: {
      host?: string;
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: () => void;
        onStateChange: (e: { data: number }) => void;
        onError: (e: { data: number }) => void;
      };
    },
  ) => YtPlayer;
};

declare global {
  interface Window {
    YT?: YtApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/** API-ийн script-ийг нэг л удаа ачаална. */
function loadApi(): Promise<YtApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  return new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT as YtApi);
    };
    if (!document.getElementById("yt-api")) {
      const script = document.createElement("script");
      script.id = "yt-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.head.append(script);
    }
  });
}

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-music"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): MusicPref {
  const value = document.documentElement.dataset.music;
  return isMusicPref(value) ? value : DEFAULT_MUSIC;
}

function getServerSnapshot(): MusicPref {
  return DEFAULT_MUSIC;
}

/** Хөгжмийн горимыг DOM-оос уншина (улирал, дуутай ижил загвар). */
export function useMusicPref(): MusicPref {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function apply(pref: MusicPref) {
  document.documentElement.dataset.music = pref;
  try {
    localStorage.setItem(MUSIC_STORAGE_KEY, pref);
  } catch {
    // Хадгалах боломжгүй бол ч энэ хуудсанд ажиллана.
  }
}

/**
 * Улирал бүрийн хөгжим. YouTube-ийн тоглуулагчийг нуусан байдлаар
 * ачаалж, улирал солигдоход бичлэгийг сольдог.
 *
 * Тоглуулагч нь зөвхөн товч дарсны дараа үүснэ — браузер хэрэглэгчийн
 * товшилтгүйгээр дуутай видео эхлүүлэхийг хориглодог.
 */
export function MusicPlayer() {
  const pref = useMusicPref();
  const season = useSeason();
  const mount = useRef<HTMLDivElement>(null);
  const player = useRef<YtPlayer | null>(null);
  // Алдааг бичлэгийн id-гаар санана — улирал солигдоход өөрөө "цэвэрлэгдэнэ".
  const [failedId, setFailedId] = useState<string | null>(null);

  const track = TRACKS[season];
  const on = pref === "on";
  const failed = failedId === track.id;

  useEffect(() => {
    if (!on) {
      player.current?.destroy();
      player.current = null;
      return;
    }

    let cancelled = false;

    void loadApi().then((api) => {
      if (cancelled || !mount.current || player.current) return;
      player.current = new api.Player(mount.current, {
        host: "https://www.youtube-nocookie.com",
        videoId: track.id,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            player.current?.setVolume(MUSIC_VOLUME);
            player.current?.playVideo();
          },
          // 0 = дууссан: нэг бичлэгийг давтана
          onStateChange: (event) => {
            if (event.data === 0) player.current?.playVideo();
            if (event.data === 1) setFailedId(null);
          },
          // Зарим бичлэгийг эзэмшигч нь embed дотор тоглуулахыг хориглодог
          // (101/150). Тэр үед чимээгүй бүтэлгүйтэхийн оронд YouTube руу
          // хөтлөх холбоос үзүүлнэ.
          onError: (event) => {
            if (EMBED_BLOCKED_CODES.includes(event.data)) {
              setFailedId(document.documentElement.dataset.season
                ? TRACKS[document.documentElement.dataset.season as SeasonKey].id
                : null);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
    };
    // Улирал солигдоход тоглуулагчийг дахин үүсгэхгүй — доорх effect сольно.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);

  useEffect(() => {
    if (!on) return;
    player.current?.loadVideoById(track.id);
    player.current?.setVolume(MUSIC_VOLUME);
  }, [on, track.id]);

  return (
    <>
      {/* Тоглуулагч нүдэнд харагдахгүй — зөвхөн дуу */}
      <div aria-hidden className="pointer-events-none fixed h-0 w-0 overflow-hidden">
        <div ref={mount} />
      </div>

      {on && failed ? (
        <a
          href={`https://www.youtube.com/watch?v=${track.id}`}
          target="_blank"
          rel="noreferrer"
          title="Энэ бичлэгийг сайт дотор тоглуулахыг зөвшөөрөөгүй байна"
          className="glass fixed bottom-[4.6rem] right-5 z-30 flex max-w-[70vw] items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-ink-soft transition-colors hover:text-ink sm:text-sm"
        >
          <span aria-hidden className="text-base leading-none">
            ↗
          </span>
          <span className="truncate">YouTube дээр сонсох</span>
        </a>
      ) : null}

      <button
        type="button"
        onClick={() => apply(on ? "off" : "on")}
        aria-pressed={on}
        title={
          on
            ? "Хөгжим унтраах"
            : `${track.title} — ${track.artist} (YouTube дээрээс)`
        }
        className={`glass fixed ${
          on && failed ? "bottom-[8.2rem]" : "bottom-[4.6rem]"
        } right-5 z-30 flex max-w-[70vw] cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-ink-soft transition-colors hover:text-ink sm:text-sm`}
      >
        <span aria-hidden className="text-base leading-none">
          {on ? "⏸" : "🎵"}
        </span>
        <span className="truncate">
          {on ? `${track.title} · ${track.artist}` : "Хөгжим"}
        </span>
      </button>
    </>
  );
}
