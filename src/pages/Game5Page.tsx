import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExitButton from "../components/ExitButton";

const W = 1920;
const H = 1080;

// hooks
function useGameScale() {
  const [scale, setScale] = useState(1);

  const update = useCallback(() => {
    setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  return scale;
}

// constants
const NOTI_POSITIONS = [
  { id: 1, left: 1071, top: 153, w: 383 },
  { id: 2, left: 1405, top: 170, w: 425.86 },
  { id: 3, left: 907, top: 345, w: 540.14 },
  { id: 4, left: 1261, top: 489, w: 579.55 },
  { id: 5, left: 1063, top: 743, w: 728.92 },
];

export default function Game5Page() {
  const navigate = useNavigate();
  const scale = useGameScale();

  // game states
  const [hasStarted, setHasStarted] = useState(false);
  const [plateIndex, setPlateIndex] = useState(1);
  const [handSpongeState, setHandSpongeState] = useState(0);
  const [notiCount, setNotiCount] = useState(0);

  // UI Presentation States
  const [showLukPai, setShowLukPai] = useState(false);
  const [showKhobKhun, setShowKhobKhun] = useState(false);
  const [showRewardScreen, setShowRewardScreen] = useState(false);

  // Reward Screen States
  const [msgIndex, setMsgIndex] = useState(1);
  const [calendarClicked, setCalendarClicked] = useState(false);
  const [circleTs, setCircleTs] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (hasStarted && notiCount < 5) {
      const timer = setTimeout(() => setNotiCount((prev) => prev + 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasStarted, notiCount]);

  useEffect(() => {
    if (notiCount === 5) {
      const t1 = setTimeout(() => setShowLukPai(true), 2000);
      const t2 = setTimeout(() => setShowKhobKhun(true), 3500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [notiCount]);

  useEffect(() => {
    if (!showRewardScreen) return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => {
        if (prev >= 4) {
          clearInterval(interval);
          return 4;
        }
        return prev + 1;
      });
    }, 2300);
    return () => clearInterval(interval);
  }, [showRewardScreen]);

  // event handlers
  const handleWash = () => {
    if (!hasStarted) setHasStarted(true);
    setPlateIndex((prev) => (prev < 10 ? prev + 1 : 10));

    setHandSpongeState(1);
    setTimeout(() => setHandSpongeState(2), 100);
    setTimeout(() => setHandSpongeState(0), 200);
  };

  const handleKhobKhunClick = () => {
    setShowRewardScreen(true);
  };

  const handleCalendarDay13 = () => {
    if (calendarClicked) return;
    setCalendarClicked(true);
    setCircleTs(Date.now());
    setMsgIndex(5);

    setTimeout(() => {
      if ("startViewTransition" in document) {
        (document as any).startViewTransition(() => navigate("/end"));
      } else {
        navigate("/end");
      }
    }, 2000);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden font-sans bg-black">
      <style>{`
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation-duration: 0.8s; 
          mix-blend-mode: normal;
        }
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.7); }
          60% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes chatMsgSlideUpCycle {
          0% { opacity: 0; transform: translateY(50px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          86% { opacity: 0; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(0); }
        }
        @keyframes chatMsgSlideUpFinal {
          0% { opacity: 0; transform: translateY(50px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes chatSlideUp {
          0% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-chat-slide-up {
          animation: chatSlideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>

      {/* Background (Blur Layer) */}
      <div
        className="absolute inset-0 z-0 bg-center bg-cover blur-[2px] scale-105 transition-all duration-500"
        style={{
          backgroundImage: `url(${showRewardScreen ? "/figma-assets/game5/bg-blue.webp" : "/figma-assets/game5/bg.webp"})`,
        }}
      />

      {/* Main Container Scaled */}
      <div
        className="relative shrink-0 overflow-hidden z-10"
        style={{ width: W * scale, height: H * scale }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: W, height: H, transform: `scale(${scale})` }}
        >
          <ExitButton mode="absolute" />

          {/* Base Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src="/figma-assets/game5/bg.webp"
              alt="background"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Game Logic Layer */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Dish & Hand Area */}
            <div className="absolute left-[158px] top-[110px] w-[855px] h-[860px]">
              <img
                src={`/figma-assets/game5/dish-${plateIndex}.webp`}
                alt="Current Plate"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />

              {!showRewardScreen && (
                <button
                  onClick={handleWash}
                  className={`absolute left-[469px] top-[315px] w-[373px] outline-none pointer-events-auto transition-transform duration-100 origin-bottom-right
                    ${handSpongeState === 1 ? "-translate-x-10 -translate-y-5 -rotate-12" : ""}
                    ${handSpongeState === 2 ? "translate-x-6 translate-y-2 rotate-6" : ""}
                    ${handSpongeState === 0 ? "hover:scale-105 active:scale-100" : ""}
                  `}
                >
                  <img
                    src="/figma-assets/game5/hand.webp"
                    alt="Hand"
                    className="w-full h-auto select-none pointer-events-none"
                  />
                </button>
              )}
            </div>

            {/* Initial Instructions */}
            {!hasStarted && (
              <>
                <div className="absolute left-[1117px] top-[555px] w-[622px] pointer-events-none z-[25]">
                  <img
                    src="/figma-assets/game5/click-prompt.webp"
                    alt="Instruction"
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="absolute left-[1179px] top-[762px] w-[515.25px] pointer-events-none z-[25]">
                  <img
                    src="/figma-assets/game5/to-wash-dish.webp"
                    alt="Instruction"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </>
            )}

            {/* Notifications Map */}
            {NOTI_POSITIONS.slice(0, notiCount).map((noti, index) => {
              const isLatest = index === notiCount - 1;
              const notiImgSrc = `/figma-assets/game5/notification-${noti.id}.webp`;

              return (
                <div
                  key={noti.id}
                  className="absolute z-[25] pointer-events-none animate-chat-slide-up"
                  style={{
                    left: `${noti.left}px`,
                    top: `${noti.top}px`,
                    width: `${noti.w}px`,
                  }}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={notiImgSrc}
                      alt="Notification"
                      className="w-full object-contain relative z-10 block"
                    />
                    {!isLatest && (
                      <div
                        className="absolute inset-0 z-20 pointer-events-none bg-[#353535]/50"
                        style={{
                          WebkitMaskImage: `url(${notiImgSrc})`,
                          WebkitMaskSize: "contain",
                          WebkitMaskPosition: "center",
                          WebkitMaskRepeat: "no-repeat",
                          maskImage: `url(${notiImgSrc})`,
                          maskSize: "contain",
                          maskPosition: "center",
                          maskRepeat: "no-repeat",
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}

            {showLukPai && (
              <div
                className="absolute left-[92px] top-[264px] w-[675.86px] z-[26] pointer-events-none"
                style={{
                  animation:
                    "fadeInScale 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
                }}
              >
                <img
                  src="/figma-assets/game5/son-leaves.webp"
                  alt="son leaves"
                  className="w-full object-contain"
                />
              </div>
            )}

            {showKhobKhun && !showRewardScreen && (
              <button
                onClick={handleKhobKhunClick}
                className="absolute left-[495px] top-[851px] w-[1002px] z-[30] pointer-events-auto hover:scale-105 active:scale-100 transition-transform duration-150 outline-none"
                style={{
                  animation:
                    "fadeInScale 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
                }}
              >
                <img
                  src="/figma-assets/game5/thank-you.webp"
                  alt="thank you"
                  className="w-full object-contain pointer-events-none"
                />
                <img
                  src="/figma-assets/multi/click-animation.png"
                  alt="cursor"
                  className="absolute bottom-[-435px] right-[-575px] h-[1100px] w-auto max-w-none object-contain pointer-events-none"
                />
              </button>
            )}
          </div>

          {/* Reward Screen Layer */}
          {showRewardScreen && (
            <div
              className="absolute inset-0 z-50 pointer-events-auto"
              style={{ animation: "fadeIn 0.5s ease-out forwards" }}
            >
              <div className="absolute inset-0 pointer-events-none">
                <img
                  src="/figma-assets/game5/bg-blue.webp"
                  alt="blue background"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Calendar Container */}
              <div
                className="absolute left-[593px] top-[195px] w-[760.2px] pointer-events-none"
                style={{ animation: "fadeInScale 0.6s ease-out forwards" }}
              >
                <div className="relative w-full h-full">
                  <img
                    src="/figma-assets/game5/calendar.webp"
                    alt="calendar"
                    className="w-full object-contain"
                  />

                  <button
                    onClick={handleCalendarDay13}
                    disabled={calendarClicked}
                    aria-label="วันที่ 13"
                    className={`absolute pointer-events-auto transition-all duration-200 border-none outline-none ${
                      calendarClicked
                        ? "cursor-default"
                        : "cursor-pointer hover:bg-black/10"
                    }`}
                    style={{
                      top: "263px",
                      left: "110px",
                      width: "105px",
                      height: "82px",
                    }}
                  />

                  {calendarClicked && circleTs && (
                    <img
                      key={`circle-${circleTs}`}
                      src={`/figma-assets/game1/circle.gif?t=${circleTs}`}
                      alt="Selected Circle"
                      className="absolute pointer-events-none z-[10] max-w-none -translate-x-1/2 -translate-y-1/2"
                      style={{
                        top: "54%",
                        left: "21%",
                        width: "auto",
                        height: "700px",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Boss GIF */}
              <div
                className="absolute left-[1087px] top-[649px] w-[368px] pointer-events-none"
                style={{ animation: "fadeInScale 0.6s 0.2s ease-out both" }}
              >
                <img
                  src="/figma-assets/game5/boss.gif"
                  alt="boss"
                  className="w-full object-contain"
                />
              </div>

              {/* Chat Messages */}
              <div className="absolute right-[766.83px] top-[765px] h-[125.09px] pointer-events-none">
                <img
                  key={msgIndex}
                  src={`/figma-assets/game5/message-${msgIndex}.webp`}
                  alt="message"
                  className="w-full object-contain"
                  style={{
                    animation:
                      msgIndex < 4
                        ? "chatMsgSlideUpCycle 2.3s forwards"
                        : "chatMsgSlideUpFinal 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}