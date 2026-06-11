import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const W = 1920;

const JOB_IMAGES = [
  "/figma-assets/multi/driving.webp",
  "/figma-assets/multi/phone-call.webp",
  "/figma-assets/multi/eating.webp",
  "/figma-assets/multi/thinking-work.webp",
  "/figma-assets/multi/email.webp",
] as const;

function ClickCursor({ positionClass }: { positionClass: string }) {
  return (
    <img
      src="/figma-assets/multi/click-animation.png"
      alt="cursor"
      className={`absolute h-[1020px] w-auto max-w-none object-contain pointer-events-none ${positionClass}`}
    />
  );
}

function useScale() {
  const [scale, setScale] = useState(1);
  const onResize = useCallback(() => {
    setScale(Math.min(1, window.innerWidth / W));
  }, []);

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onResize]);

  return scale;
}

export function MultitaskingPage() {
  const scale = useScale();
  const navigate = useNavigate();

  const scrollRef = useRef<HTMLDivElement>(null);
  const chatTriggerRef = useRef<HTMLDivElement>(null);

  const [jobStep, setJobStep] = useState(0);
  const [chatPhase, setChatPhase] = useState(0);

  const showBossChat = chatPhase >= 1;
  const showBossMsg = chatPhase >= 2;
  const isMomNotiActive = chatPhase === 3;
  const showMomChat = chatPhase >= 4;
  const showMomMsg = chatPhase >= 5;
  const showOkGif = chatPhase >= 6;
  const showSendBtn = chatPhase >= 7;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && chatPhase === 0) {
          setChatPhase(1);
        }
      },
      { threshold: 0.1 },
    );
    if (chatTriggerRef.current) observer.observe(chatTriggerRef.current);

    return () => observer.disconnect();
  }, [chatPhase]);

  useEffect(() => {
    let timer: number | undefined;

    if ([1, 2, 4, 5].includes(chatPhase)) {
      timer = window.setTimeout(() => setChatPhase((prev) => prev + 1), 1000);
    } else if (chatPhase === 6) {
      timer = window.setTimeout(() => setChatPhase(7), 7500);
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [chatPhase]);

  const handleNextPage = () => {
    // @ts-ignore
    if (document.startViewTransition) {
      // @ts-ignore
      document.startViewTransition(() => navigate("/game1"));
    } else {
      navigate("/game1");
    }
  };

  const baseChatClass = "transition-all duration-500 ease-out";

  return (
    <div
      ref={scrollRef}
      className="h-screen w-full overflow-y-auto overflow-x-hidden bg-[#d3d3d3] smooth-scroll"
    >
      <style>{`
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation-duration: 0.5s;
          mix-blend-mode: normal;
        }
      `}</style>

      <div
        className="relative mx-auto"
        style={{ width: W * scale, height: 2158 * scale }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: W, height: 2158, transform: `scale(${scale})` }}
        >
          <section className="relative h-[2158px] w-[1920px] overflow-hidden bg-white">
            {/* background */}
            <img
              src="/figma-assets/multi/background.webp"
              alt="background"
              className="absolute left-0 bottom-0 w-[1920px] min-h-[1200px] object-cover object-bottom pointer-events-none z-0"
            />

            {/* brain and switch task */}
            <div className="absolute left-0 top-0 h-[1116px] w-[1920px] bg-transparent z-10">
              <img
                src="/figma-assets/multi/brain.webp"
                alt="brain"
                className="absolute left-[150px] top-[80px] h-[890px] w-auto object-contain"
              />
              <img
                src="/figma-assets/multi/definition.webp"
                alt=""
                className="absolute left-[60px] top-[300px] h-[220px] w-auto object-contain"
              />
              <img
                src="/figma-assets/multi/many-things.webp"
                alt=""
                className="absolute left-[80px] top-[680px] h-[183px] w-auto object-contain"
              />
              <img
                src="/figma-assets/multi/simultaneous-tasks.webp"
                alt=""
                className="absolute left-[550px] top-[850px] h-[130px] w-auto object-contain"
              />
              <img
                src="/figma-assets/multi/switching.webp"
                alt=""
                className="absolute left-[1290px] top-[820px] h-[70px] w-auto object-contain"
              />
              <img
                src="/figma-assets/multi/back-forth.webp"
                alt=""
                className="absolute left-[1490px] top-[915px] h-[50px] w-auto object-contain"
              />
              <img
                src="/figma-assets/multi/task-switch.gif"
                alt=""
                className="absolute left-[1498px] top-[778px] w-[120px] scale-[2.5] origin-top-left pointer-events-none"
              />

              <button
                type="button"
                onClick={() => setJobStep((v) => (v + 1) % JOB_IMAGES.length)}
                className="absolute left-[1365px] top-[328px] z-50 cursor-pointer border-0 bg-transparent p-0 transition-transform hover:scale-105 active:scale-100 flex items-center justify-center"
              >
                <img
                  src={JOB_IMAGES[jobStep]}
                  alt="ปุ่มสลับงาน"
                  className="h-[166px] w-auto object-contain"
                />
                {jobStep === 0 && (
                  <ClickCursor positionClass="bottom-[-410px] right-[-552px]" />
                )}
              </button>
            </div>

            {/* chat trigger */}
            <div
              ref={chatTriggerRef}
              className="absolute top-[85%] w-full h-10"
            />

            <div className="absolute left-0 top-[1116px] h-[1042px] w-[1920px] z-10">
              {/* boss's chat */}
              <div
                className={`absolute right-[0.05px] bottom-[327.5px] w-[998.95px] ${baseChatClass} ${showBossChat ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              >
                <img
                  src="/figma-assets/multi/boss-chat.webp"
                  alt="boss chat"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div
                className={`absolute right-[471.4px] bottom-[260.06px] w-[370.6px] ${baseChatClass} ${showBossMsg ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              >
                <img
                  src="/figma-assets/multi/boss-message.webp"
                  alt="boss message"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* mom's notification */}
              <button
                onClick={() => isMomNotiActive && setChatPhase(4)}
                className={`absolute left-[605px] bottom-[434px] w-[674.15px] z-50 transition-all duration-300 ease-out hover:scale-105 active:scale-100 ${
                  isMomNotiActive
                    ? "opacity-100 cursor-pointer"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <img
                  src="/figma-assets/multi/mom-notification.webp"
                  alt="mom notification"
                  className="w-full h-auto"
                />
                <ClickCursor positionClass="bottom-[-415px] right-[-552px]" />
              </button>

              {/* mom's chat */}
              <div
                className={`absolute left-[55px] bottom-[234.07px] w-[967.42px] ${baseChatClass} ${showMomChat ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              >
                <img
                  src="/figma-assets/multi/mom-chat.webp"
                  alt="mom chat"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div
                className={`absolute left-[219px] bottom-[98.06px] w-[395.91px] ${baseChatClass} ${showMomMsg ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              >
                <img
                  src="/figma-assets/multi/mom-message.webp"
                  alt="mom message"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* ok sticker */}
              <div
                className={`absolute left-[628px] bottom-[25px] w-[1046px] ${baseChatClass} ${showOkGif ? "opacity-100" : "opacity-0"}`}
              >
                <img
                  src="/figma-assets/multi/ok.gif"
                  alt="ok"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* send button */}
              <button
                onClick={handleNextPage}
                className={`absolute right-[67.7px] bottom-[61.3px] w-[183.3px] z-10 transition-all duration-500 ease-out hover:duration-300 hover:scale-105 active:scale-100 ${
                  showSendBtn
                    ? "opacity-100 cursor-pointer"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <img
                  src="/figma-assets/multi/send-btn.webp"
                  alt="send"
                  className="w-full h-auto"
                />
                <ClickCursor positionClass="bottom-[-438px] right-[-570px]" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}