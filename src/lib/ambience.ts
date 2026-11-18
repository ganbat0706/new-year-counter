/**
 * Орчны дуу — бэлэн аудио файлгүй, бүгд Web Audio-гоор синтезчилнэ.
 * `mixFor` нь цэвэр функц тул Node-оор шууд шалгаж болно.
 */

import type { DaypartKey } from "@/lib/dayparts";
import type { SeasonKey } from "@/lib/seasons";

/** Дөрвөн давхаргын чанга (0–1). */
export type AmbienceMix = {
  /** Салхи — үргэлж суурь дэвсгэр */
  wind: number;
  /** Урсах усны чимээ — өвөлд гол хөлддөг тул намдана */
  water: number;
  /** Шувууны жиргээ — зөвхөн дулаан улиралд, гэрэлтэй үед */
  birds: number;
  /** Өвлийн сийрэг хонх */
  bells: number;
};

const SILENT: AmbienceMix = { wind: 0, water: 0, birds: 0, bells: 0 };

/** Улирал ба цагийн үеэс давхаргын чанга гаргана. */
export function mixFor(season: SeasonKey, daypart: DaypartKey): AmbienceMix {
  const night = daypart === "night";
  const lowLight = night || daypart === "dusk";

  const wind =
    season === "winter" ? (night ? 0.5 : 0.38) : night ? 0.26 : 0.18;

  // Өвөлд гол хөлдсөн тул зөвхөн сулхан шажигнаан үлдэнэ.
  const water = season === "winter" ? 0.06 : 0.3;

  // Шувууд үүрээр хамгийн идэвхтэй, шөнө огт жиргэхгүй.
  let birds = 0;
  if (season === "spring" || season === "summer") {
    birds = daypart === "dawn" ? 1 : daypart === "day" ? 0.7 : lowLight ? 0.15 : 0;
  } else if (season === "autumn") {
    birds = daypart === "dawn" ? 0.5 : daypart === "day" ? 0.35 : 0;
  }
  if (night) birds = 0;

  const bells = season === "winter" ? (lowLight ? 0.5 : 0.28) : 0;

  return { wind, water, birds, bells };
}

type Engine = {
  setMix: (mix: AmbienceMix) => void;
  stop: () => void;
  /** Зөвхөн шалгалтад — одоогийн чанга */
  readonly state: AudioContextState;
};

/** Урт давталттай цагаан шуугианы буфер. */
function noiseBuffer(ctx: AudioContext): AudioBuffer {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i += 1) {
    // Бага зэрэг "хүрэн" шуугиан — цэвэр цагаанаас чихэнд зөөлөн.
    last = (last + Math.random() * 2 - 1) * 0.5;
    data[i] = last;
  }
  return buffer;
}

function loopingNoise(ctx: AudioContext, buffer: AudioBuffer) {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.start();
  return source;
}

/** Удаан хэлбэлзэл — дууг механик биш, амьд болгоно. */
function slowLfo(ctx: AudioContext, target: AudioParam, depth: number, seconds: number) {
  const lfo = ctx.createOscillator();
  const gain = ctx.createGain();
  lfo.frequency.value = 1 / seconds;
  gain.gain.value = depth;
  lfo.connect(gain).connect(target);
  lfo.start();
  return lfo;
}

/**
 * Аудио хөдөлгүүрийг үүсгэнэ. Хэрэглэгчийн товшилтын дараа л дуудагдана
 * (браузер өөрөө autoplay-г хориглодог).
 */
export function createAmbience(): Engine | null {
  const Ctor =
    typeof window === "undefined"
      ? undefined
      : window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
  if (!Ctor) return null;

  const ctx = new Ctor();
  const master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);

  const buffer = noiseBuffer(ctx);
  const nodes: { source: AudioBufferSourceNode; lfos: OscillatorNode[] }[] = [];

  /** Шуугианаас шүүсэн нэг давхарга. */
  function layer(type: BiquadFilterType, frequency: number, q: number, wobble: number) {
    const source = loopingNoise(ctx, buffer);
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = q;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    source.connect(filter).connect(gain).connect(master);
    const lfos = [slowLfo(ctx, filter.frequency, frequency * wobble, 11 + wobble * 20)];
    nodes.push({ source, lfos });
    return gain;
  }

  const wind = layer("bandpass", 420, 0.6, 0.35);
  const water = layer("highpass", 1100, 0.7, 0.12);

  // Шувуу ба хонх — товч дуу тул урьдчилан хийлгүй, хэрэгцээтэй үед үүснэ.
  const birds = ctx.createGain();
  birds.gain.value = 0;
  birds.connect(master);

  const bells = ctx.createGain();
  bells.gain.value = 0;
  bells.connect(master);

  let stopped = false;
  let chirpTimer: ReturnType<typeof setTimeout> | undefined;
  let bellTimer: ReturnType<typeof setTimeout> | undefined;

  /** Нэг жиргээ — давтамж нь хурдан өөрчлөгдөх богино дуу. */
  function chirp(level: number) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    const base = 1900 + Math.random() * 1700;
    osc.type = "sine";
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.exponentialRampToValueAtTime(base * 1.6, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(base * 0.85, now + 0.13);
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.06 * level, now + 0.015);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    osc.connect(env).connect(birds);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  /** Нэг хонх — удаан унтардаг гурвалсан аялгуу. */
  function bell(level: number) {
    const now = ctx.currentTime;
    const root = [523.25, 659.25, 783.99][Math.floor(Math.random() * 3)];
    [1, 2.01].forEach((ratio, index) => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = root * ratio;
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime((index ? 0.015 : 0.035) * level, now + 0.01);
      env.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
      osc.connect(env).connect(bells);
      osc.start(now);
      osc.stop(now + 2.5);
    });
  }

  let current: AmbienceMix = SILENT;

  function scheduleChirp() {
    if (stopped) return;
    const gap = 1.6 + Math.random() * 5;
    chirpTimer = setTimeout(() => {
      if (current.birds > 0) {
        const burst = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < burst; i += 1) {
          setTimeout(() => !stopped && current.birds > 0 && chirp(current.birds), i * 110);
        }
      }
      scheduleChirp();
    }, gap * 1000);
  }

  function scheduleBell() {
    if (stopped) return;
    bellTimer = setTimeout(
      () => {
        if (current.bells > 0) bell(current.bells);
        scheduleBell();
      },
      (6 + Math.random() * 9) * 1000,
    );
  }

  scheduleChirp();
  scheduleBell();

  function ramp(param: AudioParam, value: number) {
    param.cancelScheduledValues(ctx.currentTime);
    param.setValueAtTime(param.value, ctx.currentTime);
    param.linearRampToValueAtTime(value, ctx.currentTime + 1.2);
  }

  return {
    setMix(mix) {
      current = mix;
      ramp(wind.gain, mix.wind * 0.18);
      ramp(water.gain, mix.water * 0.1);
      ramp(birds.gain, mix.birds > 0 ? 1 : 0);
      ramp(bells.gain, mix.bells > 0 ? 1 : 0);
      if (ctx.state === "suspended") void ctx.resume();
    },
    stop() {
      stopped = true;
      clearTimeout(chirpTimer);
      clearTimeout(bellTimer);
      nodes.forEach(({ source, lfos }) => {
        source.stop();
        lfos.forEach((lfo) => lfo.stop());
      });
      void ctx.close();
    },
    get state() {
      return ctx.state;
    },
  };
}
