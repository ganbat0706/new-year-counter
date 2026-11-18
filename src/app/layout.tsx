import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import {
  DAYPART_BY_HOUR,
  DAYPART_KEYS,
  DAYPART_STORAGE_KEY,
} from "@/lib/dayparts";
import { DEFAULT_SOUND, SOUND_STORAGE_KEY } from "@/lib/sound";
import {
  SEASON_BY_MONTH,
  SEASON_KEYS,
  SEASON_STORAGE_KEY,
} from "@/lib/seasons";
import "./globals.css";

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Шинэ жил хүртэл · Дөрвөн улирал",
  description:
    "Хавар, зун, намар, өвөл — улирал бүрийн тэнгэр дор шинэ жил эхлэх хүртэлх хугацааг тоолно.",
};

/**
 * HTML задрах үед, зураг гарахаас өмнө ажиллана: огноогоор улирлыг олж,
 * хэрэглэгчийн сонголт байвал түүнийг давуулж тавина. Ингэснээр
 * server-ийн `winter` анхдагч богино хугацаанд ч анивчихгүй.
 *
 * Сарын хүснэгт, түлхүүр, нэрс бүгд `@/lib/seasons`-оос гардаг тул
 * TypeScript тал өөрчлөгдвөл энэ script мөн дагаж өөрчлөгдөнө.
 */
const SEASON_SCRIPT = `(function(){try{var r=document.documentElement,s=${JSON.stringify(
  SEASON_BY_MONTH,
)}[new Date().getMonth()],v=localStorage.getItem(${JSON.stringify(
  SEASON_STORAGE_KEY,
)}),d="auto";if(${JSON.stringify(
  SEASON_KEYS,
)}.indexOf(v)>-1){s=v;d="manual"}r.setAttribute("data-season",s);r.setAttribute("data-season-mode",d)}catch(e){}})()`;

/**
 * Улирлынхтай яг адил зарчим — зөвхөн сарын оронд цагаар. Цагийн хүснэгт,
 * түлхүүр, нэрс нь `@/lib/dayparts`-оос гардаг тул гараар хуулах зүйл алга.
 */
const DAYPART_SCRIPT = `(function(){try{var r=document.documentElement,s=${JSON.stringify(
  DAYPART_BY_HOUR,
)}[new Date().getHours()],v=localStorage.getItem(${JSON.stringify(
  DAYPART_STORAGE_KEY,
)}),d="auto";if(${JSON.stringify(
  DAYPART_KEYS,
)}.indexOf(v)>-1){s=v;d="manual"}r.setAttribute("data-daypart",s);r.setAttribute("data-daypart-mode",d)}catch(e){}})()`;

/** Дууны горим — зөвхөн хадгалсан сонголтыг сэргээнэ (анхдагч нь дуугүй). */
const SOUND_SCRIPT = `(function(){try{var r=document.documentElement,v=localStorage.getItem(${JSON.stringify(
  SOUND_STORAGE_KEY,
)});r.setAttribute("data-sound",v==="on"?"on":${JSON.stringify(
  DEFAULT_SOUND,
)})}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="mn"
      data-season="winter"
      data-season-mode="auto"
      data-daypart="night"
      data-daypart-mode="auto"
      data-sound="off"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `${SEASON_SCRIPT};${DAYPART_SCRIPT};${SOUND_SCRIPT}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
