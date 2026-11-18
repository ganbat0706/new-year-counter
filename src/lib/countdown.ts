export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
};

/** Өгөгдсөн агшнаас хойшхи хамгийн ойрын шинэ жилийн эхлэл (орон нутгийн цагаар). */
export function nextNewYear(from: Date): Date {
  const candidate = new Date(from.getFullYear(), 0, 1, 0, 0, 0, 0);
  if (candidate.getTime() > from.getTime()) return candidate;
  return new Date(from.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
}

/** Үлдсэн хугацааг өдөр/цаг/минут/секунд болгон задлана. */
export function timeLeftUntil(target: Date, now: Date): TimeLeft {
  const total = Math.max(0, target.getTime() - now.getTime());
  const seconds = Math.floor(total / 1000);
  return {
    days: Math.floor(seconds / 86_400),
    hours: Math.floor((seconds % 86_400) / 3_600),
    minutes: Math.floor((seconds % 3_600) / 60),
    seconds: seconds % 60,
    total,
  };
}

/**
 * Шинэ жил дөнгөж эхэлсэн эсэх. `nextNewYear` нь 1-р сарын 1-ний 00:00:00
 * дээр аль хэдийн дараа жил рүү шилждэг тул "үлдсэн хугацаа тэг" гэсэн
 * нөхцөл хэзээ ч биелдэггүй — эхний нэг цагийг баярын цонх болгов.
 */
export function newYearJustArrived(now: Date): boolean {
  return now.getMonth() === 0 && now.getDate() === 1 && now.getHours() < 1;
}

export function pad(value: number, length = 2): string {
  return String(value).padStart(length, "0");
}
