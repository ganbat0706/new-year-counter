import { Countdown } from "@/components/Countdown";
import { Scene } from "@/components/Scene";
import { SeasonGlyph } from "@/components/SeasonGlyph";
import { SeasonSwitcher } from "@/components/SeasonSwitcher";
import { SEASON_LIST } from "@/lib/seasons";

export default function Home() {
  return (
    <>
      <Scene />
      <SeasonSwitcher />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-14 px-6 pb-20 pt-40 sm:gap-20 sm:pb-28 sm:pt-36">
        {/* Дөрвүүлээ зурагдаж, идэвхтэй нэг нь л харагдана. */}
        <header className="w-full">
          {SEASON_LIST.map((season) => (
            <div key={season.key} data-scene={season.key}>
              <div className="animate-rise flex flex-col items-center gap-5 text-center">
                <SeasonGlyph
                  season={season.key}
                  className="animate-float h-12 w-12 text-accent drop-shadow-[0_0_24px_rgb(var(--s-glow)/0.7)]"
                />

                <h1 className="sheen-text animate-sheen font-display text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-6xl">
                  {season.title}
                </h1>

                <p className="max-w-md text-pretty text-base leading-relaxed text-ink-soft/85 sm:text-lg">
                  {season.tagline}
                </p>
              </div>
            </div>
          ))}
        </header>

        <Countdown />
      </main>

      <footer className="relative z-10 px-6 pb-10 text-center text-xs tracking-wide text-ink-soft/55">
        {SEASON_LIST.map((season) => (
          <span key={season.key} data-scene={season.key}>
            {season.footer}
          </span>
        ))}
      </footer>
    </>
  );
}
