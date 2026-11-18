import {
  Aurora,
  Moon,
  ShootingStars,
  Stars,
  Sun,
} from "@/components/scene/Celestial";
import { Garland } from "@/components/scene/Garland";
import { Orbs } from "@/components/scene/Orbs";
import { Particles, type ParticleLayer } from "@/components/scene/Particles";
import { Sky } from "@/components/scene/Sky";
import {
  Forest,
  Grass,
  Ground,
  Hills,
  type TreeLayer,
} from "@/components/scene/Trees";
import { Clouds, Mist } from "@/components/scene/Weather";
import { Birds, Butterflies } from "@/components/scene/Wildlife";

/**
 * Унах ширхэгүүдийн гурван давхарга — хол нь жижиг, бүдэг, удаан;
 * ойрынх том, тод, хурдан. `scale` нь дэлбээ/навчийг цаснаас томруулна.
 */
function fallLayers(seed: number, scale: number): ParticleLayer[] {
  return [
    {
      seed,
      count: 40,
      size: [1.5 * scale, 3 * scale],
      duration: [17, 27],
      opacity: 0.45,
      blur: "blur-[1px]",
    },
    {
      seed: seed + 101,
      count: 24,
      size: [3 * scale, 5 * scale],
      duration: [11, 18],
      opacity: 0.72,
      blur: "",
    },
    {
      seed: seed + 202,
      count: 11,
      size: [5 * scale, 8 * scale],
      duration: [7, 13],
      opacity: 0.9,
      blur: "blur-[0.5px]",
    },
  ];
}

/** Ойн гурван давхарга — агаарын перспективээр холоос ойр руу. */
function forestLayers(
  seed: number,
  shape: TreeLayer["shape"],
  tint: [number, number, number],
  nearShape: TreeLayer["shape"] = shape,
): TreeLayer[] {
  return [
    {
      seed,
      count: 16,
      shape,
      height: [15, 23],
      color: "text-far",
      tint: tint[0],
      blur: "blur-[2.5px]",
      bottom: "bottom-[13vh]",
    },
    {
      seed: seed + 11,
      count: 11,
      shape,
      height: [23, 33],
      color: "text-mid",
      tint: tint[1],
      blur: "blur-[1px]",
      bottom: "bottom-[7vh]",
    },
    {
      seed: seed + 22,
      count: 8,
      shape: nearShape,
      height: [33, 48],
      color: "text-near",
      tint: tint[2],
      blur: "",
      bottom: "bottom-0",
    },
  ];
}

function SpringScene() {
  return (
    <>
      <Sun x="24%" y="56%" size={9} />
      <Clouds seed={5_101} count={5} tone="rgb(var(--s-ground) / 0.45)" />
      <Hills />
      <Forest layers={forestLayers(5_201, "blossom", [0.2, 0.34, 0.5])} />
      <Ground height="15vh" />
      <Grass seed={5_301} count={46} />
      <Particles shape="petal" layers={fallLayers(5_401, 1.6)} />
      <Orbs seed={5_501} count={10} />
      <Butterflies seed={5_601} count={5} />
    </>
  );
}

function SummerScene() {
  return (
    <>
      <Sun x="50%" y="58%" size={13} />
      <Clouds seed={6_101} count={4} tone="rgb(var(--s-ground) / 0.3)" />
      <Birds seed={6_201} count={6} />
      <Hills />
      <Forest layers={forestLayers(6_301, "leafy", [0.16, 0.26, 0.36])} />
      <Ground height="16vh" />
      <Grass seed={6_401} count={58} />
      <Particles shape="mote" layers={fallLayers(6_501, 1).slice(0, 2)} />
      <Orbs seed={6_601} count={22} mode="firefly" />
    </>
  );
}

function AutumnScene() {
  return (
    <>
      <Sun x="76%" y="50%" size={10} />
      <Clouds seed={7_101} count={5} tone="rgb(var(--s-ground) / 0.35)" />
      <Birds seed={7_201} count={5} />
      <Hills />
      <Forest layers={forestLayers(7_301, "leafy", [0.3, 0.42, 0.55], "bare")} />
      <Mist seed={7_401} count={4} />
      <Ground height="17vh" />
      <Particles shape="leaf" layers={fallLayers(7_501, 1.7)} />
      <Orbs seed={7_601} count={12} />
    </>
  );
}

function WinterScene() {
  return (
    <>
      <Stars seed={8_101} count={70} />
      <ShootingStars />
      <Aurora />
      <Moon />
      <Forest layers={forestLayers(8_201, "pine", [0, 0, 0])} />
      <Ground height="16vh" />
      <Particles shape="snow" layers={fallLayers(8_301, 1)} />
      <Orbs seed={8_401} count={14} />
    </>
  );
}

const SCENES = {
  spring: SpringScene,
  summer: SummerScene,
  autumn: AutumnScene,
  winter: WinterScene,
} as const;

/**
 * Дөрвөн тайз зэрэг зурагдаж, идэвхгүй нь `display:none` болдог тул
 * нуугдсан давхаргын анимаци зогсоно — улирал солих нь шууд, сэргээлтгүй.
 */
export function Scene() {
  return (
    <>
      <Sky />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
      >
        {Object.entries(SCENES).map(([key, SeasonScene]) => (
          <div
            key={key}
            data-scene={key}
            className="animate-fade absolute inset-0"
          >
            <SeasonScene />
          </div>
        ))}
      </div>

      {/* Гэрлийн хэлхээ зөвхөн өвөлд, контентын дээгүүр унжина. */}
      <div data-scene="winter">
        <Garland />
      </div>
    </>
  );
}
