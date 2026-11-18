/**
 * Цасан хүн ба хоёр хүүхэд — зөвхөн өвлийн тайзанд.
 *
 * 24 секундын мөчлөг: хүүхдүүд бөмбөрөг өнхрүүлнэ → доод, дунд, дээд
 * бөмбөрөг нэг нэгээр тавигдана → малгай, нүд, гар нэмэгдэнэ → хүүхдүүд
 * баярлан үсэрч, дараа нь шинээр эхэлнэ. Дараалал нь `globals.css`
 * доторх `snowfolk-*` keyframes-ээр явагдана.
 *
 * Хөдөлгөөнгүй горимд: бөмбөрөг, малгай, нүд, гар нь суурь төлөвтөө
 * (бүрэн босгосон цасан хүн) үлдэнэ — хүүхдүүд `motion-only` тул нуугдана.
 */
export function Snowfolk() {
  return (
    <div className="snowfolk absolute bottom-[13vh] left-[16%] h-[20vh] w-[26vh] sm:left-[20%]">
      {/* Цасан хүн — доод, дунд, дээд бөмбөрөг */}
      <div className="snow-ball snow-ball-base absolute bottom-0 left-[34%] h-[8vh] w-[8vh] rounded-full" />
      <div className="snow-ball snow-ball-mid absolute bottom-[7vh] left-[38%] h-[6vh] w-[6vh] rounded-full" />
      <div className="snow-ball snow-ball-top absolute bottom-[12.4vh] left-[41.5%] h-[4.4vh] w-[4.4vh] rounded-full" />

      {/* Нүүр — хоёр нүд, лууван хамар */}
      <div className="snow-face absolute bottom-[14.6vh] left-[43%] h-[1.6vh] w-[3.4vh]">
        <span className="absolute left-[18%] top-0 h-[0.7vh] w-[0.7vh] rounded-full bg-near/70" />
        <span className="absolute right-[18%] top-0 h-[0.7vh] w-[0.7vh] rounded-full bg-near/70" />
        <span className="absolute left-1/2 top-[0.8vh] h-[0.5vh] w-[1.6vh] -translate-x-1/2 rounded-r-full bg-accent/90" />
      </div>

      {/* Малгай — тагтай, ирмэгтэй */}
      <div className="snow-hat absolute bottom-[16.2vh] left-[40%] h-[2.6vh] w-[5.6vh]">
        <span className="absolute bottom-0 left-0 h-[0.6vh] w-full rounded-full bg-near/85" />
        <span className="absolute bottom-[0.5vh] left-1/2 h-[2.1vh] w-[3.4vh] -translate-x-1/2 rounded-t-[0.6vh] bg-near/85" />
      </div>

      {/* Саваа гар */}
      <div className="snow-arms absolute bottom-[9.4vh] left-[36%] h-[4vh] w-[9vh]">
        <span className="absolute left-0 top-[1.4vh] h-[0.35vh] w-[3.4vh] origin-right -rotate-[22deg] rounded-full bg-near/70" />
        <span className="absolute right-0 top-[1.4vh] h-[0.35vh] w-[3.4vh] origin-left rotate-[26deg] rounded-full bg-near/70" />
      </div>

      {/* Хүүхдүүд — силуэт. Нэг нь бөмбөрөг өнхрүүлж, нөгөө нь үсэрнэ. */}
      <Kid className="snow-kid-a motion-only absolute bottom-0 left-0 h-[9vh] w-[4vh]" />
      <Kid className="snow-kid-b motion-only absolute bottom-0 right-[4%] h-[8vh] w-[3.6vh]" />

      {/* Өнхрүүлж буй бөмбөрөг */}
      <div className="snow-roll motion-only absolute bottom-0 left-[12%] h-[3vh] w-[3vh] rounded-full" />
    </div>
  );
}

/** Нэг хүүхдийн силуэт — толгой, бие, хөл. */
function Kid({ className }: { className: string }) {
  return (
    <div className={className}>
      <span className="absolute left-1/2 top-0 h-[2.2vh] w-[2.2vh] -translate-x-1/2 rounded-full bg-near/80" />
      <span className="absolute left-1/2 top-[2vh] h-[4vh] w-[2.8vh] -translate-x-1/2 rounded-[1vh] bg-near/80" />
      <span className="absolute bottom-0 left-[22%] h-[2.4vh] w-[0.8vh] rounded-full bg-near/80" />
      <span className="absolute bottom-0 right-[22%] h-[2.4vh] w-[0.8vh] rounded-full bg-near/80" />
    </div>
  );
}
