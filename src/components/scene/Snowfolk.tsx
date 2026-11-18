/**
 * Цасан хүн ба хоёр хүүхэд — зөвхөн өвлийн тайзанд.
 *
 * 24 секундын мөчлөг: хүүхдүүд бөмбөрөг өнхрүүлнэ → доод, дунд, дээд
 * бөмбөрөг нэг нэгээр тавигдана → малгай, нүүр, гар нэмэгдэнэ → хүүхдүүд
 * баярлан үсэрч, дараа нь шинээр эхэлнэ. Дараалал нь `globals.css`
 * доторх `snowfolk-*` keyframes-ээр явагдана.
 *
 * Хэмжээ: хүүхэд ~6vh, цасан хүн ~10vh — хүнээс арай өндөр, тайзны
 * модтой зохицсон харьцаа.
 *
 * Хөдөлгөөнгүй горимд: бөмбөрөг, малгай, нүд, гар нь суурь төлөвтөө
 * (бүрэн босгосон цасан хүн) үлдэнэ — хүүхдүүд `motion-only` тул нуугдана.
 */
export function Snowfolk() {
  return (
    <div className="snowfolk absolute bottom-[13vh] left-[17%] h-[13vh] w-[17vh] sm:left-[21%]">
      {/* Цасан хүн — доод, дунд, дээд бөмбөрөг */}
      <div className="snow-ball snow-ball-base absolute bottom-0 left-[36%] h-[5vh] w-[5vh] rounded-full" />
      <div className="snow-ball snow-ball-mid absolute bottom-[4.3vh] left-[40%] h-[3.7vh] w-[3.7vh] rounded-full" />
      <div className="snow-ball snow-ball-top absolute bottom-[7.5vh] left-[43%] h-[2.7vh] w-[2.7vh] rounded-full" />

      {/* Нүүр — хоёр нүд, лууван хамар */}
      <div className="snow-face absolute bottom-[8.8vh] left-[44%] h-[1vh] w-[2.1vh]">
        <span className="absolute left-[14%] top-0 h-[0.42vh] w-[0.42vh] rounded-full bg-near/70" />
        <span className="absolute right-[14%] top-0 h-[0.42vh] w-[0.42vh] rounded-full bg-near/70" />
        <span className="absolute left-1/2 top-[0.5vh] h-[0.3vh] w-[1vh] -translate-x-1/2 rounded-r-full bg-accent/90" />
      </div>

      {/* Малгай — тагтай, ирмэгтэй */}
      <div className="snow-hat absolute bottom-[9.8vh] left-[41.5%] h-[1.6vh] w-[3.4vh]">
        <span className="absolute bottom-0 left-0 h-[0.38vh] w-full rounded-full bg-near/85" />
        <span className="absolute bottom-[0.3vh] left-1/2 h-[1.3vh] w-[2.1vh] -translate-x-1/2 rounded-t-[0.4vh] bg-near/85" />
      </div>

      {/* Саваа гар */}
      <div className="snow-arms absolute bottom-[5.6vh] left-[36%] h-[2.4vh] w-[5.6vh]">
        <span className="absolute left-0 top-[0.9vh] h-[0.25vh] w-[2.1vh] origin-right -rotate-[22deg] rounded-full bg-near/70" />
        <span className="absolute right-0 top-[0.9vh] h-[0.25vh] w-[2.1vh] origin-left rotate-[26deg] rounded-full bg-near/70" />
      </div>

      {/* Хүүхдүүд — силуэт. Нэг нь бөмбөрөг өнхрүүлж, нөгөө нь малгай авчирна. */}
      <Kid className="snow-kid-a motion-only absolute bottom-0 left-0 h-[6vh] w-[2.6vh]" />
      <Kid className="snow-kid-b motion-only absolute bottom-0 right-[2%] h-[5.4vh] w-[2.4vh]" />

      {/* Өнхрүүлж буй бөмбөрөг */}
      <div className="snow-roll motion-only absolute bottom-0 left-[14%] h-[2vh] w-[2vh] rounded-full" />
    </div>
  );
}

/** Нэг хүүхдийн силуэт — толгой, бие, хөл. */
function Kid({ className }: { className: string }) {
  return (
    <div className={className}>
      <span className="absolute left-1/2 top-0 h-[1.5vh] w-[1.5vh] -translate-x-1/2 rounded-full bg-near/80" />
      <span className="absolute left-1/2 top-[1.35vh] h-[2.8vh] w-[1.9vh] -translate-x-1/2 rounded-[0.7vh] bg-near/80" />
      <span className="absolute bottom-0 left-[18%] h-[1.8vh] w-[0.55vh] rounded-full bg-near/80" />
      <span className="absolute bottom-0 right-[18%] h-[1.8vh] w-[0.55vh] rounded-full bg-near/80" />
    </div>
  );
}
