import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ExitButton from "../components/ExitButton";

const W = 1920;
const H = 1080;

const HAND_IMAGE_SRC = "/figma-assets/game1/hand.webp";
const MOTHER_MASK_GIF_SRC = "/figma-assets/game1/mom-mask.gif";
const TABLE_IMAGE_SRC = "/figma-assets/game1/schedule-table.webp";
const REMEMBER_IMAGE_SRC = "/figma-assets/game1/remember.webp";

const WATBUN_IMAGE_SRC = "/figma-assets/game1/temple-bunrod.webp";
const WATSONG_IMAGE_SRC = "/figma-assets/game1/temple-bunsong.webp";
const EY_IMAGE_SRC = "/figma-assets/game1/oops.webp";
const WATLOD_IMAGE_SRC = "/figma-assets/game1/temple-lodbun.webp";
const READY_IMAGE_SRC = "/figma-assets/game1/ready.webp";
const CALENDAR_IMAGE_SRC = "/figma-assets/game1/calendar.webp";

const BUNSONG_REPLY_SRC = "/figma-assets/game1/reply-temple1.webp";
const WATLOD_REPLY_SRC = "/figma-assets/game1/reply-temple2.webp";
const WATBUN_REPLY_SRC = "/figma-assets/game1/reply-temple3.webp";

const END_CAT_GIF_SRC = "/figma-assets/game1/cat-end.gif";
const CIRCLE_MARK_GIF_SRC = "/figma-assets/game1/circle.gif";

const PETTING_CAT_TITLE_SRC = "/figma-assets/game1/petting-cat.webp";
const AUTOMATIC_ACTIVITY_TITLE_SRC =
  "/figma-assets/game1/automatic-activity.webp";
const CONSIDERED_AS_TEXT_SRC = "/figma-assets/game1/considered-as.webp";
const CAN_BE_WELL_DONE_TEXT_SRC = "/figma-assets/game1/can-do-well.webp";
const FINAL_HEART_GIF_SRC = "/figma-assets/game1/heart.gif";

const CORRECT_GIF_SRC = "/figma-assets/game1/mom-correct.gif";
const WRONG_GIF_SRC = "/figma-assets/game1/mom-wrong.gif";

const HEART1_IMAGE_SRC = "/figma-assets/game1/heart-1.webp";
const HEART2_IMAGE_SRC = "/figma-assets/game1/heart-2.webp";
const HEART3_IMAGE_SRC = "/figma-assets/game1/heart-3.webp";
const HEART4_IMAGE_SRC = "/figma-assets/game1/heart-4.webp";
const HEART5_IMAGE_SRC = "/figma-assets/game1/heart-5.webp";
const HEART6_IMAGE_SRC = "/figma-assets/game1/heart-6.webp";
const HEART7_IMAGE_SRC = "/figma-assets/game1/heart-7.webp";
const HEART8_IMAGE_SRC = "/figma-assets/game1/heart-8.webp";
const HEART9_IMAGE_SRC = "/figma-assets/game1/heart-end.webp";

const HAND_PET_START_X = 1546;
const HAND_PET_Y = 513;

function useScale() {
  const [scale, setScale] = useState(1);
  const onResize = useCallback(() => {
    const scaleX = window.innerWidth / W;
    const scaleY = window.innerHeight / H;
    setScale(Math.min(scaleX, scaleY));
  }, []);

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onResize]);

  return scale;
}

const CALENDAR_DAYS: { day: number; col: number; row: number }[] = [];
let currentDayCounter = 1;
for (let r = 0; r < 5; r++) {
  for (let c = 0; c < 7; c++) {
    if (r === 0 && c < 3) continue;
    if (currentDayCounter > 31) break;
    CALENDAR_DAYS.push({ day: currentDayCounter, col: c, row: r });
    currentDayCounter++;
  }
}

export function Game1Page() {
  const scale = useScale();
  const navigate = useNavigate();

  const [introState, setIntroState] = useState<"text" | "hand">("text");
  const [textOpacity, setTextOpacity] = useState(1);
  const [handOpacity, setHandOpacity] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [handX, setHandX] = useState(HAND_PET_START_X);
  const [petCount, setPetCount] = useState(0);

  const startX = useRef(0);
  const accumDistance = useRef(0);

  const [motherStarted, setMotherStarted] = useState(false);
  const [motherStep, setMotherStep] = useState(0);

  const [calendarResult, setCalendarResult] = useState<
    "none" | "correct" | "wrong"
  >("none");
  const [gifTimestamp, setGifTimestamp] = useState(Date.now());
  const [answeredCount, setAnsweredCount] = useState(0);

  const [clickData, setClickData] = useState<{
    x: number;
    y: number;
    ts: number;
  } | null>(null);
  const [isProcessingClick, setIsProcessingClick] = useState(false);
  const isGameFullyComplete = answeredCount >= 3 && petCount >= 9;
  const [showAutoActivity, setShowAutoActivity] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setTextOpacity(0);
      const timer2 = setTimeout(() => {
        setIntroState("hand");
        setHandOpacity(1);
      }, 500);
      return () => clearTimeout(timer2);
    }, 1500);
    return () => clearTimeout(timer1);
  }, []);

  useEffect(() => {
    if (petCount >= 3 && !motherStarted) {
      setMotherStarted(true);
    }
  }, [petCount, motherStarted]);

  useEffect(() => {
    if (motherStarted && motherStep < 8) {
      const delay = motherStep === 0 ? 0 : 2000;
      const timer = setTimeout(() => {
        setMotherStep((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [motherStarted, motherStep]);

  useEffect(() => {
    if (calendarResult === "none") return;

    const autoDismissTimer = setTimeout(() => {
      setAnsweredCount((prev) => prev + 1);
      setCalendarResult("none");
      setClickData(null);
    }, 2000);

    return () => clearTimeout(autoDismissTimer);
  }, [calendarResult]);

  useEffect(() => {
    if (answeredCount >= 3) {
      const timer = setTimeout(() => {
        setShowAutoActivity(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [answeredCount]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (introState !== "hand") return;

    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    startX.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const dx = (e.clientX - startX.current) / scale;
    const newX = Math.max(
      HAND_PET_START_X - 420,
      Math.min(HAND_PET_START_X, HAND_PET_START_X + dx),
    );

    const handDeltaX = newX - handX;
    accumDistance.current += Math.abs(handDeltaX);

    if (accumDistance.current > 1000) {
      setPetCount((prev) => prev + 1);
      accumDistance.current = 0;
    }

    setHandX(newX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    setHandX(HAND_PET_START_X);
  };

  const getReloadableGifUrl = (baseSrc: string) =>
    `${baseSrc}?t=${gifTimestamp}`;

  let currentCorrectDay = 29;
  if (answeredCount === 1) currentCorrectDay = 9;
  if (answeredCount === 2) currentCorrectDay = 19;

  const handleCalendarClick = (
    e: React.MouseEvent,
    day: number,
    col: number,
    row: number,
  ) => {
    e.stopPropagation();
    if (isProcessingClick) return;
    setIsProcessingClick(true);

    const isCorrect = day === currentCorrectDay;

    const CELL_W = 97;
    const CELL_H = 80;
    const BASE_LEFT = 8.5;
    const GAP_X = 94;
    const BASE_TOP = 68;
    const GAP_Y = 91;

    const centerX = BASE_LEFT + col * GAP_X + CELL_W / 2;
    const centerY = BASE_TOP + row * GAP_Y + CELL_H / 2;

    setClickData({ x: centerX, y: centerY, ts: Date.now() });

    setTimeout(() => {
      setGifTimestamp(Date.now());
      setCalendarResult(isCorrect ? "correct" : "wrong");
      setIsProcessingClick(false);
    }, 300);
  };

  const dismissGifHandler = () => {
    if (calendarResult !== "none") {
      setAnsweredCount((prev) => prev + 1);
    }
    setCalendarResult("none");
    setClickData(null);
  };

  const handleNextGame = () => {
    // @ts-ignore
    if (document.startViewTransition) {
      // @ts-ignore
      document.startViewTransition(() => navigate("/game2"));
    } else {
      navigate("/game2");
    }
  };

  let currentReplySrc = BUNSONG_REPLY_SRC;
  if (answeredCount === 1) currentReplySrc = WATLOD_REPLY_SRC;
  if (answeredCount >= 2) currentReplySrc = WATBUN_REPLY_SRC;

  let currentHeartSrc = HEART1_IMAGE_SRC;
  if (petCount === 1) currentHeartSrc = HEART1_IMAGE_SRC;
  else if (petCount === 2) currentHeartSrc = HEART2_IMAGE_SRC;
  else if (petCount === 3) currentHeartSrc = HEART3_IMAGE_SRC;
  else if (petCount === 4) currentHeartSrc = HEART4_IMAGE_SRC;
  else if (petCount === 5) currentHeartSrc = HEART5_IMAGE_SRC;
  else if (petCount === 6) currentHeartSrc = HEART6_IMAGE_SRC;
  else if (petCount === 7) currentHeartSrc = HEART7_IMAGE_SRC;
  else if (petCount === 8) currentHeartSrc = HEART8_IMAGE_SRC;
  else if (petCount >= 9) currentHeartSrc = HEART9_IMAGE_SRC;

  if (isGameFullyComplete) {
    currentHeartSrc = FINAL_HEART_GIF_SRC;
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-r from-[#FBFBC6] to-[#FAFAB1]">
      <style>{`
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation-duration: 0.8s; 
          mix-blend-mode: normal;
        }

        @keyframes strongBounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.15); }
          75% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes smoothFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-smooth-fade-in {
          animation: smoothFadeIn 0.5s ease-in-out forwards;
        }
      `}</style>

      <img
        src="/figma-assets/game1/flower-background.webp"
        alt="Blurred BG"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none z-0 blur-[10px] opacity-100"
      />

      <div
        className="relative shrink-0 overflow-hidden"
        style={{ width: W * scale, height: H * scale }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: W, height: H, transform: `scale(${scale})` }}
        >
          <section className="relative h-[1080px] w-[1920px] overflow-hidden bg-transparent">
            <ExitButton mode="absolute" />
            
            {/* background */}
            <img
              src="/figma-assets/game1/flower-background.webp"
              alt="BG"
              className="absolute inset-0 h-full w-full object-fill pointer-events-none z-0"
            />

            {/* cat 1 */}
            <img
              src="/figma-assets/game1/cat.png"
              alt="Cat Normal"
              className={`absolute left-[660px] bottom-[-315px] w-[2000px] rotate-[31.14deg] object-contain pointer-events-none z-[1] transition-opacity duration-300 ease-in-out ${
                isGameFullyComplete ? "opacity-0" : "opacity-100"
              }`}
            />

            {/* cat 2 */}
            {isGameFullyComplete && (
              <img
                src={END_CAT_GIF_SRC}
                alt="Cat End"
                className="absolute left-[680px] bottom-[-225px] w-[1800px] rotate-[29.05deg] object-contain pointer-events-none z-[1] animate-smooth-fade-in"
              />
            )}

            {/* hand to pet cat */}
            <div
              className="absolute z-[2] touch-none cursor-grab active:cursor-grabbing select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{
                left: `${handX}px`,
                top: `${HAND_PET_Y}px`,
                width: "267px",
                height: "491px",
                opacity: handOpacity,
                transition: isDragging
                  ? "none"
                  : "left 0.3s ease-out, opacity 1s",
                pointerEvents: introState === "hand" ? "auto" : "none",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <img
                src={HAND_IMAGE_SRC}
                alt="Hand"
                draggable={false}
                className="h-[491px] w-auto object-contain pointer-events-none select-none"
              />
            </div>

            {/* text when launch game */}
            <div
              className="absolute left-0 top-0 w-full h-full pointer-events-none z-[3]"
              style={{
                opacity: textOpacity,
                transition: "opacity 1s ease-in-out",
              }}
            >
              <img
                src="/figma-assets/game1/scroll-prompt.webp"
                alt="เลื่อน"
                className="absolute left-[71px] top-[262px] w-[295px] h-auto"
              />
              <img
                src="/figma-assets/game1/mouse-cursor.webp"
                alt="เมาส์"
                className="absolute left-[336.91px] top-[230px] w-[287px] h-auto"
              />
              <img
                src="/figma-assets/game1/left-arrow.webp"
                alt="ซ้าย"
                className="absolute left-[303px] top-[375px] w-[255px] h-auto"
              />
              <img
                src="/figma-assets/game1/-.webp"
                alt="-"
                className="absolute left-[549.28px] top-[378.29px] w-[35px] h-auto"
              />
              <img
                src="/figma-assets/game1/right-arrow.webp"
                alt="ขวา"
                className="absolute left-[587px] top-[367px] w-[210px] h-auto"
              />
              <img
                src="/figma-assets/game1/to-pet.webp"
                alt="to pet"
                className="absolute left-[277px] bottom-[265px] w-[350px] h-auto rotate-3"
              />
              <img
                src="/figma-assets/game1/brownie.webp"
                alt="brownie"
                className="absolute left-[620.55px] bottom-[220px] w-[320px] h-auto rotate-3"
              />
            </div>

            {/* mom's speech run automatically */}
            <img
              src={MOTHER_MASK_GIF_SRC}
              alt="Mom"
              className="absolute z-[4] pointer-events-none"
              style={{
                left: "-692px",
                top: "-285px",
                width: "2200px",
                opacity: motherStarted && answeredCount < 3 ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            />
            <img
              src={TABLE_IMAGE_SRC}
              alt="Table"
              className="absolute z-[4] pointer-events-none transition-all duration-300 ease-in-out"
              style={{
                left: "447px",
                top: motherStep === 1 ? "73px" : "157px",
                width: motherStep === 1 ? "741px" : "495px",
                opacity:
                  motherStarted && motherStep >= 1 && motherStep < 3 ? 1 : 0,
              }}
            />

            <img
              src={REMEMBER_IMAGE_SRC}
              alt="Rem"
              className="absolute z-[4] pointer-events-none"
              style={{
                left: "330px",
                top: "277px",
                width: "630px",
                opacity: motherStarted && motherStep === 2 ? 1 : 0,
                animation:
                  motherStarted && motherStep === 2
                    ? "strongBounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
                    : "none",
              }}
            />

            <img
              src={WATBUN_IMAGE_SRC}
              alt="Wat1"
              className="absolute z-[4] pointer-events-none"
              style={{
                left: "442px",
                top: "85px",
                width: "414.04px",
                opacity: motherStarted && motherStep === 3 ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            />
            <img
              src={WATSONG_IMAGE_SRC}
              alt="Wat2"
              className="absolute z-[4] pointer-events-none"
              style={{
                left: "442px",
                top: "85px",
                width: "399.5px",
                opacity: motherStarted && motherStep === 4 ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            />
            <img
              src={EY_IMAGE_SRC}
              alt="Ey"
              className="absolute z-[4] pointer-events-none"
              style={{
                left: "442px",
                top: "85px",
                width: "284.16px",
                opacity: motherStarted && motherStep === 5 ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            />
            <img
              src={WATLOD_IMAGE_SRC}
              alt="Wat3"
              className="absolute z-[4] pointer-events-none"
              style={{
                left: "442px",
                top: "85px",
                width: "487.99px",
                opacity: motherStarted && motherStep === 6 ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            />

            <img
              src={READY_IMAGE_SRC}
              alt="Ready"
              className="absolute z-[4] pointer-events-none"
              style={{
                left: "351px",
                top: "251px",
                width: "577.13px",
                opacity: motherStarted && motherStep === 7 ? 1 : 0,
                animation:
                  motherStarted && motherStep === 7
                    ? "strongBounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
                    : "none",
              }}
            />

            {/* heart & reply */}
            <img
              src={currentHeartSrc}
              alt="StepHeart"
              className="absolute z-[4] pointer-events-none"
              style={{
                left: isGameFullyComplete ? "1470px" : "1447.92px",
                top: isGameFullyComplete ? "130px" : "139.6px",
                width: isGameFullyComplete ? "290px" : "351.17px",
                opacity: petCount > 0 ? 1 : 0,
                transition: "opacity 0.2s ease-in-out",
              }}
            />
            <img
              src={currentReplySrc}
              alt="Reply"
              className="absolute z-[4] pointer-events-none"
              style={{
                left: "442px",
                top: "85px",
                height: "124.53px",
                opacity: motherStep >= 8 && answeredCount < 3 ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            />

            {/* calendar 1-31 */}
            <div
              className="absolute z-[4]"
              style={{
                left: "324px",
                bottom: "76px",
                width: "686px",
                height: "551px",
                opacity: motherStep >= 7 && answeredCount < 3 ? 1 : 0,
                pointerEvents:
                  motherStep >= 7 && answeredCount < 3 ? "auto" : "none",
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              <img
                src={CALENDAR_IMAGE_SRC}
                alt="Cal"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />

              {/* spaces for 1-31 */}
              {CALENDAR_DAYS.map(({ day, col, row }) => (
                <button
                  key={day}
                  onClick={(e) => handleCalendarClick(e, day, col, row)}
                  className="absolute cursor-pointer rounded-[8px] hover:bg-black/30 transition-colors duration-200"
                  style={{
                    left: `${11 + col * 94}px`,
                    top: `${81 + row * 91}px`,
                    width: "97px",
                    height: "80px",
                  }}
                />
              ))}

              {/* circle gif */}
              {clickData && (
                <img
                  src={`${CIRCLE_MARK_GIF_SRC}?t=${clickData.ts}`}
                  alt="Circle Mark"
                  className="absolute pointer-events-none z-[10] -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${clickData.x}px`,
                    top: `${clickData.y}px`,
                    width: "auto",
                    height: "800px",
                    maxWidth: "none",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>

            {/* end game */}
            {answeredCount >= 3 && (
              <>
                <img
                  src={PETTING_CAT_TITLE_SRC}
                  alt="FinalTitle"
                  className="absolute z-[4] pointer-events-none"
                  style={{ left: "66px", top: "167px", width: "852px" }}
                />

                <img
                  src={CONSIDERED_AS_TEXT_SRC}
                  alt="T1"
                  className="absolute z-[4] pointer-events-none"
                  style={{
                    left: "240px",
                    top: "541px",
                    width: "230.22px",
                    opacity: showAutoActivity ? 1 : 0,
                    transition: "opacity 0.8s ease-in-out",
                  }}
                />
                <button
                  type="button"
                  onClick={handleNextGame}
                  className={`absolute z-[5] cursor-pointer border-0 bg-transparent p-0 transition-opacity duration-1000 ${
                    showAutoActivity
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                  style={{ left: "325px", top: "652px", width: "730px" }}
                >
                  <div className="relative w-full h-full transition-transform duration-300 hover:scale-105 active:scale-100 drop-shadow-[7px_7px_10px_rgba(0,0,0,0.75)]">
                    <img
                      src={AUTOMATIC_ACTIVITY_TITLE_SRC}
                      alt="Link to Game 2"
                      className="w-full h-auto object-contain"
                    />
                    <img
                      src="/figma-assets/multi/click-animation.png"
                      alt="cursor"
                      className="absolute bottom-[-435px] right-[-595px] h-[1050px] w-auto max-w-none object-contain pointer-events-none"
                    />
                  </div>
                </button>
                <img
                  src={CAN_BE_WELL_DONE_TEXT_SRC}
                  alt="T3"
                  className="absolute z-[4] pointer-events-none"
                  style={{
                    left: "123px",
                    top: "759px",
                    width: "780.09px",
                    opacity: showAutoActivity ? 1 : 0,
                    transition: "opacity 0.8s ease-in-out",
                  }}
                />
              </>
            )}
          </section>
        </div>
      </div>

      {/* mom's gif */}
      <div
        onClick={dismissGifHandler}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#E8E988]/30 transition-opacity duration-300"
        style={{
          opacity: calendarResult !== "none" ? 1 : 0,
          pointerEvents: calendarResult !== "none" ? "auto" : "none",
        }}
      >
        <div
          style={{ transform: `scale(${scale})` }}
          className="flex items-center justify-center"
        >
          {calendarResult === "correct" && (
            <img
              src={getReloadableGifUrl(CORRECT_GIF_SRC)}
              className="w-[2150px] max-w-none h-auto object-contain"
            />
          )}
          {calendarResult === "wrong" && (
            <img
              src={getReloadableGifUrl(WRONG_GIF_SRC)}
              className="w-[2150px] max-w-none h-auto object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}