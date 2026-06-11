import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExitButton from "../components/ExitButton";

const imgBgSummary = "/figma-assets/game3/bg-summary.png";

const imgBossStatic = "/figma-assets/game3/boss.png";
const imgElements = "/figma-assets/game3/elements.png";
const imgHeartGif = "/figma-assets/game3/heart.gif";

const imgBossGif = "/figma-assets/game3/boss.gif";
const imgCalendar = "/figma-assets/game3/calendar.png";
const imgCallButton = "/figma-assets/game3/call-button.png";
const imgRemember = "/figma-assets/game3/remember.png";
const imgImportant = "/figma-assets/game3/important.png";

const imgSpeech1 = "/figma-assets/game3/speech-1.png";
const imgSpeech2 = "/figma-assets/game3/speech-2.png";
const imgSpeech3 = "/figma-assets/game3/speech-3.png";

const imgMomSpeech1 = "/figma-assets/game3/mom-speech-1.png";
const imgMomSpeech2 = "/figma-assets/game3/mom-speech-2.png";

const imgMomDoctorGif = "/figma-assets/game3/mom-doctor.gif";

const imgBgInsert = "/figma-assets/game3/bg-insert.png";
const imgUrgent = "/figma-assets/game3/urgent.png";
const imgHelpMom = "/figma-assets/game3/help-mom.png";
const imgMomGif = "/figma-assets/game3/mom.gif";
const imgMomCalendar = "/figma-assets/game3/mom-calendar.png";

const imgMomCalendarNew = "/figma-assets/game3/ปติทินแม่.png";
const imgBossCalendarNew = "/figma-assets/game3/ปติทินหัวหน้า.png";

const imgCircleGif = "/figma-assets/game1/circle.gif";

const imgClickStart = "/figma-assets/game3/click-start.gif";

const imgMomQ = [
  "/figma-assets/game3/mom-q1.png",
  "/figma-assets/game3/mom-q2.png",
];
const imgBossQ = [
  "/figma-assets/game3/boss-q1.png",
  "/figma-assets/game3/boss-q2.png",
];

const imgMomCorrect = "/figma-assets/game3/mom-correct.gif";
const imgMomWrong = "/figma-assets/game3/mom-wrong.gif";
const imgBossCorrect = "/figma-assets/game3/boss-correct.gif";
const imgBossWrong = "/figma-assets/game3/boss-wrong.gif";

const imgAiya = "/figma-assets/game3/aiya.png";
const imgWait = "/figma-assets/game3/wait.png";
const imgWait2 = "/figma-assets/game3/wait2.png";
const imgOkay = "/figma-assets/game3/okay.png";

const imgSlideBar = "/figma-assets/game3/slide-bar.png";
const imgSlideButton = "/figma-assets/game3/slide-button.png";
const imgSlideText = "/figma-assets/game3/Text.png";

const W = 1920;
const H = 3240;

function useGameScale() {
  const [scale, setScale] = useState(2);

  const update = useCallback(() => {
    setScale(Math.min(1, window.innerWidth / W));
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  return scale;
}

function Game3Artboard({ scale }: { scale: number }) {
  const navigate = useNavigate();

  // Slider States
  const [isHidden, setIsHidden] = useState(false);
  const [isSuccessFade, setIsSuccessFade] = useState(false);
  const SLIDE_MIN = 20;
  const SLIDE_MAX = 848;
  const SLIDE_SUCCESS = 750;

  const [slideX, setSlideX] = useState(SLIDE_MIN);
  const slideXRef = useRef(SLIDE_MIN);
  const [isSliding, setIsSliding] = useState(false);
  const dragStartRef = useRef({ x: 0, left: 0 });

  // Game Flow States
  const [step, setStep] = useState(0);

  // Chat States
  const [bossChatStates, setBossChatStates] = useState([0, 0, 0, 0]);
  const [momChatStates, setMomChatStates] = useState([0, 0, 0, 0]);

  const generateMomGrid = (correctDay: number) => {
    const grid = [];
    const cellWidth = 95;
    const cellHeight = 92;
    const startX = 130;
    const startY = 570;

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 7; col++) {
        const index = row * 7 + col;
        if (index < 3 || index === 34) continue;

        const dayNumber = index - 2;

        grid.push({
          day: dayNumber,
          left: startX + col * cellWidth,
          top: startY + row * cellHeight,
          w: cellWidth,
          h: cellHeight,
          isCorrect: dayNumber === correctDay,
        });
      }
    }
    return grid;
  };

  const generateBossGrid = (correctDay: number) => {
    const grid = [];
    const cellWidth = 105;
    const cellHeight = 82;
    const startX = 1054;
    const startY = 395;

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 7; col++) {
        const index = row * 7 + col;
        if (index < 3 || index === 34) continue;

        const dayNumber = index - 2;

        grid.push({
          day: dayNumber,
          left: startX + col * cellWidth,
          top: startY + row * cellHeight,
          w: cellWidth,
          h: cellHeight,
          isCorrect: dayNumber === correctDay,
        });
      }
    }
    return grid;
  };

  const momQuestionsData = [generateMomGrid(15), generateMomGrid(21)];
  const bossQuestionsData = [generateBossGrid(21), generateBossGrid(25)];

  const [momRound, setMomRound] = useState(0);
  const [bossRound, setBossRound] = useState(0);

  const isMomDone = momRound >= 2;
  const isBossDone = bossRound >= 2;
  const isBothDone = isMomDone && isBossDone;

  const [momPhase, setMomPhase] = useState<"idle" | "circle" | "feedback">(
    "idle",
  );
  const [bossPhase, setBossPhase] = useState<"idle" | "circle" | "feedback">(
    "idle",
  );

  const [momSelected, setMomSelected] = useState<any>(null);
  const [bossSelected, setBossSelected] = useState<any>(null);

  const [momCircleTs, setMomCircleTs] = useState<number>(0);
  const [momFeedbackTs, setMomFeedbackTs] = useState<number>(0);

  const [bossCircleTs, setBossCircleTs] = useState<number>(0);
  const [bossFeedbackTs, setBossFeedbackTs] = useState<number>(0);

  const [showWaitButton, setShowWaitButton] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (momPhase === "feedback") {
      timer = setTimeout(() => {
        setMomRound((prev) => prev + 1);
        setMomSelected(null);
        setMomPhase("idle");
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [momPhase]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (bossPhase === "feedback") {
      timer = setTimeout(() => {
        setBossRound((prev) => prev + 1);
        setBossSelected(null);
        setBossPhase("idle");
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [bossPhase]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isBothDone) {
      timer = setTimeout(() => {
        setShowWaitButton(true);
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [isBothDone]);

  const handleNavigateNext = () => {
    if ("startViewTransition" in document) {
      (document as any).startViewTransition(() => navigate("/game4"));
    } else {
      navigate("/game4");
    }
  };

  useEffect(() => {
    if (!isHidden) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const delay = (ms: number, fn: () => void) =>
      timers.push(setTimeout(fn, ms));

    if (step === 0) {
      delay(1500, () => setStep(1));
    } else if (step === 1) {
      delay(2000, () => setStep(2));
    } else if (step === 2) {
      delay(2000, () => setStep(3));
    } else if (step === 3) {
      delay(2500, () => setStep(4));
    } else if (step === 4) {
      setBossChatStates([1, 0, 0, 0]);
      delay(800, () => setStep(5));
    } else if (step === 5) {
      delay(3000, () => setStep(6));
    } else if (step === 6) {
      setBossChatStates([1, 1, 0, 0]);
      delay(2000, () => setStep(7));
    } else if (step === 7) {
      setBossChatStates([1, 1, 1, 0]);
      delay(6000, () => setStep(9));
    } else if (step === 9) {
      delay(800, () => setBossChatStates([2, 1, 1, 0]));
      delay(1600, () => setBossChatStates([2, 2, 1, 0]));
      delay(2400, () => setBossChatStates([2, 2, 2, 0]));
      delay(2800, () => setStep(10));
    } else if (step === 10) {
      delay(1500, () => setStep(11));
    } else if (step === 11) {
      delay(1000, () => setMomChatStates([1, 0, 0, 0]));
      delay(3000, () => setMomChatStates([1, 1, 0, 0]));
      delay(5500, () => setMomChatStates([2, 1, 0, 0]));
      delay(6300, () => setMomChatStates([2, 2, 0, 0]));
      delay(7500, () => setStep(12));
    }

    return () => timers.forEach(clearTimeout);
  }, [isHidden, step]);

  const handleMomSelect = (choice: any) => {
    if (momPhase !== "idle" || isMomDone || step < 13) return;
    setMomSelected(choice);
    setMomPhase("circle");
    setMomCircleTs(Date.now());

    setTimeout(() => {
      setMomPhase("feedback");
      setMomFeedbackTs(Date.now());
    }, 800);
  };

  const handleBossSelect = (choice: any) => {
    if (bossPhase !== "idle" || isBossDone || step < 13) return;
    setBossSelected(choice);
    setBossPhase("circle");
    setBossCircleTs(Date.now());

    setTimeout(() => {
      setBossPhase("feedback");
      setBossFeedbackTs(Date.now());
    }, 800);
  };

  const updateSlideX = (val: number) => {
    slideXRef.current = val;
    setSlideX(val);
  };

  const handleSlideStart = (clientX: number) => {
    setIsSliding(true);
    dragStartRef.current = { x: clientX, left: slideXRef.current };
  };

  const handleSlideMove = useCallback(
    (clientX: number) => {
      const deltaX = (clientX - dragStartRef.current.x) / scale;
      const nextX = dragStartRef.current.left + deltaX;
      updateSlideX(Math.min(SLIDE_MAX, Math.max(SLIDE_MIN, nextX)));
    },
    [scale],
  );

  const handleSlideEnd = useCallback(() => {
    setIsSliding(false);
    if (slideXRef.current >= SLIDE_SUCCESS) {
      updateSlideX(SLIDE_MAX);
      setIsSuccessFade(true);
      setTimeout(() => setIsHidden(true), 200);
    } else {
      updateSlideX(SLIDE_MIN);
    }
  }, []);

  useEffect(() => {
    if (!isSliding) return;
    const onMouseMove = (e: MouseEvent) => handleSlideMove(e.clientX);
    const onTouchMove = (e: TouchEvent) =>
      handleSlideMove(e.touches[0].clientX);
    const onEnd = () => handleSlideEnd();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isSliding, handleSlideMove, handleSlideEnd]);

  const getChatClass = (state: number) => {
    if (state === 0) return "opacity-0 translate-y-10";
    if (state === 1) return "opacity-100 translate-y-0";
    return "opacity-0 translate-y-0";
  };

  return (
    <section className="relative h-[3240px] w-[1920px] overflow-hidden bg-[#7DC3EF]">
      <img
        src={imgBgSummary}
        alt="Background"
        draggable={false}
        className="pointer-events-none absolute left-0 top-0 h-[3240px] w-[1920px] select-none object-cover"
      />

      <div
        className="pointer-events-none absolute z-10 select-none"
        style={{ left: 106, top: 153, width: 1706.99, height: 1843.13 }}
      >
        <img
          src={imgElements}
          alt="main content"
          draggable={false}
          className="h-full w-full object-contain"
        />
        <img
          src={imgHeartGif}
          alt="Heart Animation"
          draggable={false}
          className="absolute left-[12%] top-[63.3%] h-auto w-[325px] -rotate-[-10deg] object-contain"
        />
      </div>

      <div className="absolute left-0 top-0 z-20 h-[3240px] w-[1920px]">
        {isHidden ? (
          <div className="absolute left-0 top-0 h-full w-full overflow-hidden">
            {step === 1 && (
              <img
                src={imgCallButton}
                alt="Call Button"
                className="absolute left-[841px] bottom-[185.5px] w-[634px] animate-in zoom-in duration-500 object-contain z-[42]"
              />
            )}

            {step >= 2 && step <= 3 && (
              <>
                <img
                  src={imgRemember}
                  alt="Remember"
                  className="absolute right-[170px] bottom-[450px] w-[835px] h-auto max-w-none animate-in fade-in duration-500 object-contain z-[42]"
                />
                {step === 3 && (
                  <img
                    src={imgImportant}
                    alt="Important"
                    className="absolute right-[323px] bottom-[233px] w-[785px] animate-hard-pop object-contain z-[42]"
                  />
                )}
              </>
            )}

            {step >= 4 && step <= 9 && (
              <div className="absolute left-0 top-0 h-full w-full z-50 pointer-events-none">
                <img
                  src={imgSpeech1}
                  alt="Speech 1"
                  className={`absolute right-[311.98px] bottom-[157.13px] w-[510.02px] object-contain z-[43] transition-all duration-500 ease-out ${getChatClass(bossChatStates[0])}`}
                />
                <img
                  src={imgSpeech2}
                  alt="Speech 2"
                  className={`absolute right-[449.82px] bottom-[264.07px] w-[707.18px] object-contain z-[43] transition-all duration-500 ease-out ${getChatClass(bossChatStates[1])}`}
                />
                <img
                  src={imgSpeech3}
                  alt="Speech 3"
                  className={`absolute right-[64.99px] bottom-[620px] w-[707.01px] object-contain z-[43] transition-all duration-500 ease-out ${getChatClass(bossChatStates[2])}`}
                />
              </div>
            )}

            {step >= 9 && (
              <div className="animate-mom-scene absolute left-0 bottom-0 z-40 h-[1156px] w-[1103.25px] overflow-hidden pointer-events-none">
                <img
                  src={imgBgInsert}
                  alt="Insert Scene Background"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {!isMomDone && (
                  <>
                    <img
                      src={
                        step >= 13 && momPhase !== "feedback"
                          ? imgMomCalendarNew
                          : imgMomCalendar
                      }
                      alt="Mom Calendar"
                      className="absolute left-[119px] bottom-[114px] w-[692.01px] object-contain"
                    />
                    <img
                      src={imgMomGif}
                      alt="Mom"
                      className="absolute left-[53px] bottom-[625px] w-[310px] object-contain"
                    />
                  </>
                )}

                {step >= 9 && step < 11 && (
                  <img
                    src={imgHelpMom}
                    alt="Help Mom"
                    className="absolute left-[285.05px] bottom-[623.76px] w-[543px] object-contain"
                  />
                )}

                {step >= 11 && step <= 12 && (
                  <div className="absolute inset-0 z-50">
                    <img
                      src={imgMomSpeech1}
                      alt="Mom Speech 1"
                      className={`absolute left-[337px] bottom-[760.72px] w-[516.17px] object-contain transition-all duration-500 ease-out ${getChatClass(momChatStates[0])}`}
                    />
                    <img
                      src={imgMomSpeech2}
                      alt="Mom Speech 2"
                      className={`absolute left-[449px] bottom-[652.95px] w-[478.05px] object-contain transition-all duration-500 ease-out ${getChatClass(momChatStates[1])}`}
                    />
                  </div>
                )}
              </div>
            )}

            {step >= 5 && step <= 8 && (
              <img
                src={imgMomDoctorGif}
                alt="Mom talking to Doctor"
                className="animate-doc-gif absolute left-[0px] bottom-[480px] w-[1920px] object-contain z-[44]"
              />
            )}

            {step === 10 && (
              <img
                src={imgUrgent}
                alt="Urgent"
                className="absolute left-[763.59px] bottom-[416.11px] z-[99] w-[364.44px] object-contain animate-hard-pop pointer-events-none"
              />
            )}

            {step === 12 && (
              <div className="absolute inset-0 z-[150] animate-in fade-in duration-500">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setStep(13);
                  }}
                  className="group absolute bottom-[900px] right-[75px] w-[570px] h-[120px] cursor-pointer"
                >
                  <img
                    src={imgClickStart}
                    alt="คลิกเพื่อเริ่มเกม"
                    className="absolute bottom-[-540px] right-[-765px] w-[2100px] max-w-none object-contain pointer-events-none transition-transform duration-300 group-hover:scale-105 group-active:scale-100"
                  />
                </div>
              </div>
            )}

            {(step < 13 || (step >= 13 && !isBossDone)) && (
              <>
                <img
                  src={
                    step >= 13 && bossPhase !== "feedback"
                      ? imgBossCalendarNew
                      : imgCalendar
                  }
                  alt="Boss Calendar"
                  className="absolute right-[111.09px] bottom-[327.15px] w-[760.2px] object-contain z-[41]"
                />
                <img
                  src={imgBossGif}
                  alt="Boss Animation"
                  className="pointer-events-none absolute right-[10px] bottom-[60px] z-[45] w-[390px] object-contain"
                />
              </>
            )}

            {step >= 13 && (
              <div className="absolute inset-0 z-50 animate-in fade-in duration-500 pointer-events-none">
                <div className="absolute left-[0px] bottom-[0px] z-50 h-[1156px] w-[1103.25px] pointer-events-none">
                  {!isMomDone ? (
                    <>
                      <img
                        key={`mom-q-${momRound}`}
                        src={imgMomQ[momRound]}
                        alt="Mom Question"
                        className="absolute left-[346px] bottom-[728px] h-[125.94px] animate-chat-pop object-contain pointer-events-none"
                      />

                      {momPhase === "feedback" && momSelected?.isCorrect && (
                        <div className="absolute left-[110px] top-[500px] w-[700px] h-[520px] z-[60] flex items-center justify-center animate-in fade-in duration-300">
                          <img
                            key={`mom-correct-${momFeedbackTs}`}
                            src={`${imgMomCorrect}?t=${momFeedbackTs}`}
                            className="relative z-10 w-[2600px] max-w-none object-contain pointer-events-none animate-in zoom-in duration-300"
                            alt="Mom Correct"
                          />
                        </div>
                      )}

                      {momPhase === "feedback" && !momSelected?.isCorrect && (
                        <div className="absolute left-[110px] top-[480px] w-[700px] h-[520px] z-[60] flex items-center justify-center animate-in fade-in duration-300">
                          <img
                            key={`mom-wrong-${momFeedbackTs}`}
                            src={`${imgMomWrong}?t=${momFeedbackTs}`}
                            className="relative z-10 w-[2600px] max-w-none object-contain pointer-events-none animate-in zoom-in duration-300"
                            alt="Mom Wrong"
                          />
                        </div>
                      )}

                      <div className="absolute inset-0 h-full w-full pointer-events-none">
                        {momQuestionsData[momRound]?.map((btn, index) => (
                          <button
                            key={index}
                            disabled={momPhase !== "idle"}
                            className="absolute z-10 cursor-pointer border-0 bg-transparent p-0 pointer-events-auto"
                            style={{
                              left: `${btn.left}px`,
                              top: `${btn.top}px`,
                              width: `${btn.w}px`,
                              height: `${btn.h}px`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMomSelect(btn);
                            }}
                          >
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/25 transition-colors duration-200" />
                          </button>
                        ))}

                        {momSelected && (
                          <img
                            key={`mom-circle-${momCircleTs}`}
                            src={`${imgCircleGif}?t=${momCircleTs}`}
                            alt="Selected Circle"
                            className="absolute pointer-events-none z-[10] -translate-x-1/2 -translate-y-1/2"
                            style={{
                              left: `${momSelected.left + momSelected.w / 2}px`,
                              top: `${momSelected.top + momSelected.h / 4}px`,
                              width: "auto",
                              height: "800px",
                              maxWidth: "none",
                              objectFit: "contain",
                            }}
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    <img
                      src={imgAiya}
                      alt="Aiya"
                      className="absolute left-[84px] bottom-[540.3px] w-[776px] max-w-none animate-hard-pop object-contain pointer-events-none"
                    />
                  )}
                </div>

                <div className="absolute right-[0px] bottom-[0px] z-50 h-[1156px] w-[1921px] pointer-events-none">
                  {!isBossDone ? (
                    <>
                      <img
                        key={`boss-q-${bossRound}`}
                        src={imgBossQ[bossRound]}
                        alt="Boss Question"
                        className="absolute right-[330px] bottom-[170px] h-[125.01px] animate-chat-pop object-contain pointer-events-none"
                      />

                      {bossPhase === "feedback" && bossSelected?.isCorrect && (
                        <div className="absolute left-[1100px] top-[325px] w-[770px] h-[470px] z-[60] flex items-center justify-center animate-in fade-in duration-300">
                          <img
                            key={`boss-correct-${bossFeedbackTs}`}
                            src={`${imgBossCorrect}?t=${bossFeedbackTs}`}
                            className="relative z-10 w-[2600px] max-w-none object-contain pointer-events-none animate-in zoom-in duration-300"
                            alt="Boss Correct"
                          />
                        </div>
                      )}

                      {bossPhase === "feedback" && !bossSelected?.isCorrect && (
                        <div className="absolute left-[1035px] top-[325px] w-[770px] h-[470px] z-[60] flex items-center justify-center animate-in fade-in duration-300">
                          <img
                            key={`boss-wrong-${bossFeedbackTs}`}
                            src={`${imgBossWrong}?t=${bossFeedbackTs}`}
                            className="relative z-10 w-[2600px] max-w-none object-contain pointer-events-none animate-in zoom-in duration-300"
                            alt="Boss Wrong"
                          />
                        </div>
                      )}

                      <div className="absolute inset-0 h-full w-full pointer-events-none">
                        {bossQuestionsData[bossRound]?.map((btn, index) => (
                          <button
                            key={index}
                            disabled={bossPhase !== "idle"}
                            className="absolute z-10 cursor-pointer border-0 bg-transparent p-0 pointer-events-auto"
                            style={{
                              left: `${btn.left}px`,
                              top: `${btn.top}px`,
                              width: `${btn.w}px`,
                              height: `${btn.h}px`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBossSelect(btn);
                            }}
                          >
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/25 transition-colors duration-200" />
                          </button>
                        ))}

                        {bossSelected && (
                          <img
                            key={`boss-circle-${bossCircleTs}`}
                            src={`${imgCircleGif}?t=${bossCircleTs}`}
                            alt="Selected Circle"
                            className="absolute pointer-events-none z-[10] -translate-x-1/2 -translate-y-1/2"
                            style={{
                              left: `${bossSelected.left + bossSelected.w / 2}px`,
                              top: `${bossSelected.top + bossSelected.h / 4}px`,
                              width: "auto",
                              height: "800px",
                              maxWidth: "none",
                              objectFit: "contain",
                            }}
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    <img
                      src={imgOkay}
                      alt="Okay"
                      className="absolute bottom-[129.37px] right-[107.04px] w-[868.25px] max-w-none animate-hard-pop object-contain pointer-events-none"
                    />
                  )}
                </div>

                {showWaitButton && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateNext();
                    }}
                    className="group absolute left-[230px] bottom-[355.84px] z-[100] w-[1549px] cursor-pointer transition-transform hover:scale-105 active:scale-100 animate-hard-pop pointer-events-auto"
                  >
                    <img
                      src={imgWait}
                      alt="Wait Next"
                      className="w-full max-w-none object-contain pointer-events-none group-hover:opacity-0"
                    />

                    <img
                      src={imgWait2}
                      alt="Wait Next Hover"
                      className="absolute max-w-none object-contain pointer-events-none opacity-0 group-hover:opacity-100 left-[0px] top-[0px] w-[1510px] scale-100"
                    />

                    <img
                      src="/figma-assets/multi/click-animation.png"
                      alt="cursor"
                      className="absolute bottom-[-580px] right-[-790px] h-[1500px] w-auto max-w-none object-contain pointer-events-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            className={`absolute left-0 top-0 h-full w-full transition-opacity duration-300 ${
              isSuccessFade ? "opacity-0" : "opacity-100"
            }`}
          >
            <img
              src={imgBossStatic}
              alt="Boss Static"
              className="absolute left-[528px] bottom-[574px] w-[864px] object-contain"
            />

            <div
              className="absolute left-[400px] top-[2800px] w-[1119px] h-[250px] touch-none select-none"
              onDragStart={(e) => e.preventDefault()}
            >
              <img
                src={imgSlideBar}
                alt="Slide bar"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-full object-contain"
              />
              <img
                src={imgSlideText}
                alt="Slide text"
                style={{ opacity: isSliding || slideX > 25 ? 0 : 1 }}
                className="pointer-events-none absolute left-[368.82px] top-[70px] w-[579.69px] object-contain transition-opacity duration-200"
              />

              <button
                type="button"
                draggable={false}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSlideStart(e.clientX);
                }}
                onTouchStart={(e) => {
                  handleSlideStart(e.touches[0].clientX);
                }}
                style={{ left: `${slideX}px` }}
                className={`absolute top-1/2 h-[250.89px] w-[250.89px] -translate-y-1/2 cursor-grab touch-none select-none border-0 bg-transparent p-0 transition-[left] active:cursor-grabbing ${
                  isSliding ? "duration-0" : "duration-300 ease-out"
                }`}
              >
                <img
                  src={imgSlideButton}
                  alt="Slide button"
                  draggable={false}
                  className="pointer-events-none h-full w-full select-none"
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function Game3Page() {
  const scale = useGameScale();

  return (
    <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[#0d0d0d]">
      <style>{`
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation-duration: 0.8s; 
          mix-blend-mode: normal;
        }

        @keyframes docGifSlide {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(0); }
        }
        .animate-doc-gif {
          animation: docGifSlide 2.5s ease-out forwards;
        }

        @keyframes momSceneSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        .animate-mom-scene {
          animation: momSceneSlide 0.35s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }

        @keyframes urgentPop {
          0% { transform: scale(0); opacity: 0; }
          15% { transform: scale(1.3) rotate(-5deg); opacity: 1; }
          30% { transform: scale(0.85) rotate(3deg); opacity: 1; }
          45% { transform: scale(1.1) rotate(-1deg); opacity: 1; }
          60% { transform: scale(1) rotate(0deg); opacity: 1; }
          85% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        .animate-urgent-pop {
          animation: urgentPop 1.5s ease-out forwards;
        }

        @keyframes hardPop {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.2) rotate(2deg); opacity: 1; }
          75% { transform: scale(0.9) rotate(-1deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-hard-pop {
          animation: hardPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes chatPopUp {
          0% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-chat-pop {
          animation: chatPopUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
      
      <ExitButton />

      <div
        className="relative mx-auto shrink-0"
        style={{
          width: W * scale,
          height: H * scale,
        }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: W,
            height: H,
            transform: `scale(${scale})`,
          }}
        >
          <Game3Artboard scale={scale} />
        </div>
      </div>
    </div>
  );
}