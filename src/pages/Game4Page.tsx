import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ExitButton from "../components/ExitButton";
import bgImg from "/figma-assets/game4/bg.png";
import comImg from "/figma-assets/game4/laptop.png";
import notiImg from "/figma-assets/game4/notification.png";
import notiImg2 from "/figma-assets/game4/notification2.png";
import bossMsgImg from "/figma-assets/game4/boss-message.png";
import bgInsertImg from "/figma-assets/game4/bg-insert.png";
import momGif from "/figma-assets/game4/mom.gif";
import helpTextImg from "/figma-assets/game4/help.png";
import prepare from "/figma-assets/game4/prepare.png";
import boxImg from "/figma-assets/game4/parcel.png";
import waitingImg from "/figma-assets/game4/waiting.png";
import sendBtnImg from "/figma-assets/game4/send-btn.png";
import writeLabelImg from "/figma-assets/game4/write-label.png";
import momCorrectGif from "/figma-assets/game4/mom-correct.gif";
import momWrongGif from "/figma-assets/game4/mom-wrong.gif";
import bossCorrectGif from "/figma-assets/game4/boss-correct.gif";
import bossWrongGif from "/figma-assets/game4/boss-wrong.gif";
import warningImg from "/figma-assets/game4/warning.png";
import resultTextImg from "/figma-assets/game4/result-text.png";
import helpBtnImg from "/figma-assets/game4/help-btn.png";
import bossChatBoxImg from "/figma-assets/game4/boss-chat-box.png";
import momLabelImg from "/figma-assets/game4/mom-label.png";
import clickStartImg from "/figma-assets/game3/click-start.gif";

// constants
const BG_COLOR_BLUE = "#38A2CB";
const BG_COLOR_YELLOW = "#EEFF00";

const BOSS_TARGET_NUMBER = "11010";
const MOM_TARGET_NUMBER = "10110";

const W = 1920;
const H = 1080;

// helper functions
const normalizeInput = (value: string) => value.replace(/\s+/g, "");

// custom hooks
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

// main component
export default function Game4Page() {
  const navigate = useNavigate();
  const scale = useGameScale();

  const [step, setStep] = useState<number>(-1);
  const [showSummaryImages, setShowSummaryImages] = useState<boolean>(false);

  const [chatInput, setChatInput] = useState<string>("");
  const [parcelInput, setParcelInput] = useState<string>("");

  const [bossResult, setBossResult] = useState<"correct" | "wrong" | null>(
    null,
  );
  const [momResult, setMomResult] = useState<"correct" | "wrong" | null>(null);

  const [showBossGif, setShowBossGif] = useState<boolean>(false);
  const [showMomGif, setShowMomGif] = useState<boolean>(false);

  const [bossShowEndScreen, setBossShowEndScreen] = useState<boolean>(false);
  const [momShowEndScreen, setMomShowEndScreen] = useState<boolean>(false);

  const [bossDigitIndex, setBossDigitIndex] = useState<number>(-1);
  const [momDigitIndex, setMomDigitIndex] = useState<number>(-1);

  // flow control (intro)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    switch (step) {
      case -1:
        timer = setTimeout(() => setStep(0), 1000);
        break;
      case 1:
        timer = setTimeout(() => setStep(2), 1000);
        break;
      case 2:
        timer = setTimeout(() => setStep(3), 1500);
        break;
      case 3:
        timer = setTimeout(() => setStep(4), 1500);
        break;
      case 4:
        timer = setTimeout(() => setStep(5), 1000);
        break;
      case 5:
        timer = setTimeout(() => setStep(6), 1000);
        break;
      case 6:
        timer = setTimeout(() => setStep(7), 1000);
        break;
    }

    return () => clearTimeout(timer);
  }, [step]);

  // gameplay sequence
  useEffect(() => {
    if (step !== 8) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const initialDelay = 1000;

    for (let i = 0; i < 5; i++) {
      timeouts.push(
        setTimeout(() => setBossDigitIndex(i), initialDelay + i * 2000),
      );
      timeouts.push(
        setTimeout(() => setMomDigitIndex(i), initialDelay + i * 2000 + 1000),
      );
    }

    return () => timeouts.forEach(clearTimeout);
  }, [step]);

  useEffect(() => {
    if (bossShowEndScreen && momShowEndScreen) {
      const t = setTimeout(() => setShowSummaryImages(true), 1500);
      return () => clearTimeout(t);
    }
  }, [bossShowEndScreen, momShowEndScreen]);

  // handlers
  const handleBossSubmit = () => {
    if (bossResult !== null) return;

    const answer = normalizeInput(chatInput);
    setBossResult(answer === BOSS_TARGET_NUMBER ? "correct" : "wrong");
    setShowBossGif(true);

    setTimeout(() => {
      setShowBossGif(false);
      setBossShowEndScreen(true);
    }, 2500);
  };

  const handleMomSubmit = () => {
    if (momResult !== null) return;

    const answer = normalizeInput(parcelInput);
    setMomResult(answer === MOM_TARGET_NUMBER ? "correct" : "wrong");
    setShowMomGif(true);

    setTimeout(() => {
      setShowMomGif(false);
      setMomShowEndScreen(true);
    }, 2500);
  };

  const handleNavigateNext = () => {
    if ("startViewTransition" in document) {
      (document as any).startViewTransition(() => navigate("/game5"));
    } else {
      navigate("/game5");
    }
  };

  return (
    <>
      <style>{`
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation-duration: 0.8s; 
          mix-blend-mode: normal;
        }
        @keyframes slideUp {
          0% { transform: translateY(80px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          opacity: 0;
        }
        @keyframes slideInLeft {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes fadeOutFast {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-fade-out-fast {
          animation: fadeOutFast 0.3s ease-out forwards;
        }
        @keyframes fastPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2) rotate(-3deg); opacity: 1; }
          80% { transform: scale(0.9) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-fast-pop {
          animation: fastPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in forwards;
          opacity: 0;
        }
        @keyframes slideInParcel {
          0% { transform: translate3d(-800px, 0, 0); opacity: 0; }
          100% { transform: translate3d(0, 0, 0); opacity: 1; }
        }
        .animate-slide-in-parcel {
          animation: slideInParcel 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0;
          will-change: transform, opacity; 
        }
        @keyframes bounceIn {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      <div
        className="relative flex min-h-screen w-full items-center justify-center overflow-hidden transition-colors duration-500"
        style={{ backgroundColor: BG_COLOR_BLUE }}
      >
        <div
          className="absolute top-0 left-0 bottom-0 w-1/2 z-0"
          style={{
            backgroundColor: BG_COLOR_YELLOW,
            transform: step >= 3 ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        />

        <div
          className="relative shrink-0 overflow-hidden z-10"
          style={{ width: W * scale, height: H * scale }}
        >
          <div
            className="absolute left-0 top-0 origin-top-left bg-center bg-cover"
            style={{
              width: W,
              height: H,
              transform: `scale(${scale})`,
              backgroundImage: `url(${bgImg})`,
            }}
          >
            <ExitButton mode="absolute" />
            
            <div className="absolute inset-0 z-[99999] pointer-events-none">
              {/* mom */}
              {showMomGif &&
                (momResult === "correct" ? (
                  <div className="absolute bottom-[182px] right-[581px]">
                    <div className="absolute top-[222px] left-[580px] w-[790px] h-[670px] bg-black/30" />
                    <img
                      src={momCorrectGif}
                      alt="ผลลัพธ์แม่ถูก"
                      className="w-[1920px] max-w-none object-contain animate-fade-in"
                    />
                  </div>
                ) : (
                  <div className="absolute bottom-[179px] right-[576px]">
                    <div className="absolute top-[219px] left-[575px] w-[790px] h-[670px] bg-black/30" />
                    <img
                      src={momWrongGif}
                      alt="ผลลัพธ์แม่ผิด"
                      className="w-[1920px] max-w-none object-contain animate-fade-in"
                    />
                  </div>
                ))}

              {/* boss */}
              {showBossGif &&
                (bossResult === "correct" ? (
                  <div className="absolute top-[11px] left-[638px]">
                    <div className="absolute top-[110px] left-[494px] w-[800px] h-[845px] bg-black/10" />
                    <img
                      src={bossCorrectGif}
                      alt="ผลลัพธ์หัวหน้าถูก"
                      className="w-[1920px] max-w-none object-contain animate-fade-in"
                    />
                  </div>
                ) : (
                  <div className="absolute top-[0px] left-[558px]">
                    <div className="absolute top-[120px] left-[574px] w-[800px] h-[845px] bg-black/10" />
                    <img
                      src={bossWrongGif}
                      alt="ผลลัพธ์หัวหน้าผิด"
                      className="w-[1920px] max-w-none object-contain animate-fade-in"
                    />
                  </div>
                ))}
            </div>

            {/* mom zone */}
            {step >= 3 && (
              <div className="absolute inset-0 z-20 pointer-events-none animate-slide-in-left">
                <div
                  className="absolute bottom-0 left-0 w-[1103.25px] h-[1156px] bg-cover bg-right"
                  style={{ backgroundImage: `url(${bgInsertImg})` }}
                />
                {!momShowEndScreen && (
                  <img
                    src={momGif}
                    alt="แม่"
                    className="absolute bottom-[47px] left-[18px] w-[328px] object-contain"
                  />
                )}
                {step < 6 && (
                  <img
                    src={helpTextImg}
                    alt="ช่วยด้วย"
                    className="absolute bottom-[106.24px] left-[295px] w-[615px] object-contain"
                  />
                )}
              </div>
            )}

            {step >= 4 && (
              <div className="absolute inset-0 z-30 animate-slide-in-parcel pointer-events-none">
                <img
                  src={boxImg}
                  alt="พัสดุ"
                  className="absolute top-[36px] right-[1127px] w-[890px]"
                />
                {momDigitIndex >= 0 && !momShowEndScreen && (
                  <img
                    key={`mom-digit-${momDigitIndex}`}
                    src={`/figma-assets/game4/${MOM_TARGET_NUMBER[momDigitIndex]}-mom.png`}
                    alt="Mom Digit"
                    className="absolute bottom-[92.67px] left-[336px] h-[77.33px] z-50 animate-slide-up"
                  />
                )}
                <div className="absolute top-[291px] left-[104px] w-[629px] z-40 pointer-events-auto">
                  <img
                    src={momLabelImg}
                    alt="ป้ายพัสดุแม่"
                    className="w-full h-auto pointer-events-none"
                  />
                  <input
                    type="text"
                    className={`absolute bottom-[16%] left-[36%] w-[27%] h-[15%] px-1 outline-none text-2xl font-light transition-colors ${
                      parcelInput
                        ? "bg-white text-black"
                        : "bg-transparent text-transparent caret-black"
                    }`}
                    value={parcelInput}
                    onChange={(e) => setParcelInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleMomSubmit();
                      }
                    }}
                    disabled={momResult !== null}
                  />
                  <img
                    src={sendBtnImg}
                    alt="ส่ง"
                    onClick={handleMomSubmit}
                    className={`absolute top-[230px] left-[438px] w-[221px] z-40 transition-transform ${
                      momResult !== null
                        ? "cursor-not-allowed"
                        : "cursor-pointer hover:scale-105 active:scale-100"
                    }`}
                  />
                </div>
              </div>
            )}

            {step >= 5 && step < 8 && (
              <img
                src={waitingImg}
                alt="เขารออยู่"
                className="absolute top-[90.11px] left-[480.02px] w-[403.62px] z-40 animate-fast-pop pointer-events-none"
              />
            )}

            {step >= 6 && step < 8 && (
              <img
                src={writeLabelImg}
                alt="รีบเขียน"
                className="absolute bottom-[122px] left-[286px] w-[556px] z-[60] object-contain animate-fast-pop pointer-events-none"
              />
            )}

            {momShowEndScreen && (
              <div className="absolute bottom-[82.67px] left-[246.6px] w-[588.2px] z-[50] animate-bounce-in pointer-events-none">
                <img
                  src={warningImg}
                  alt="ระวังสะติแตก"
                  className="w-full h-auto"
                />
              </div>
            )}

            {step === 7 && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setStep(8);
                }}
                className="group absolute bottom-[570px] right-[40px] w-[560px] h-[100px] bg-transparent z-[100] cursor-pointer animate-fade-in"
              >
                <img
                  src={clickStartImg}
                  alt="คลิกเพื่อเริ่มเกม"
                  className="absolute bottom-[-540px] right-[-740px] h-[1150px] w-auto max-w-none object-contain pointer-events-none transition-transform duration-200 group-hover:scale-105 group-active:scale-100"
                />
              </div>
            )}

            {showSummaryImages && (
              <button
                onClick={handleNavigateNext}
                className="absolute top-[53px] left-[92px] z-[60] pointer-events-auto animate-bounce-in outline-none bg-transparent border-0 hover:scale-105 active:scale-100 transition-transform"
              >
                <img
                  src={helpBtnImg}
                  alt="มาช่วย"
                  className="w-[879px] cursor-pointer"
                />
                <img
                  src="/figma-assets/multi/click-animation.png"
                  alt="cursor"
                  className="absolute bottom-[-510px] right-[-715px] h-[1300px] w-auto max-w-none object-contain pointer-events-none"
                />
              </button>
            )}

            {/* boss zone */}
            <div className="absolute top-[82px] left-[960px] w-[1690.47px] h-[900px] z-5">
              <img src={comImg} alt="Laptop" className="w-full h-auto block" />

              {(step === 0 || step === 1) && (
                <div
                  className={`group absolute top-[88px] left-[226px] w-[570px] cursor-pointer ${
                    step === 0
                      ? "animate-slide-up"
                      : "animate-fade-out-fast pointer-events-none"
                  }`}
                  onClick={() => setStep(1)}
                >
                  <img
                    src={notiImg}
                    alt="Notification"
                    className="w-[540.14px] h-auto object-contain pointer-events-none group-hover:opacity-0"
                  />
                  <img
                    src={notiImg2}
                    alt="Notification Hover"
                    className="absolute top-[-5px] left-[-5px] w-[560.14px] h-auto object-contain pointer-events-none opacity-0 group-hover:opacity-100"
                  />
                </div>
              )}

              {step >= 1 && (
                <div className="absolute top-[509px] left-[226px] w-[542.97px] z-10 animate-slide-up">
                  <img
                    src={bossChatBoxImg}
                    alt="Chat Box"
                    className="w-full h-auto pointer-events-none"
                  />
                  <input
                    type="text"
                    className={`absolute bottom-[2%] left-[1%] w-[72%] h-[25%] px-6 outline-none text-3xl font-light transition-colors rounded-bl-[14px] ${
                      chatInput
                        ? "bg-[#DD0C86] text-white"
                        : "bg-transparent text-transparent caret-white"
                    }`}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleBossSubmit();
                      }
                    }}
                    disabled={bossResult !== null}
                  />
                  <button
                    onClick={handleBossSubmit}
                    disabled={bossResult !== null}
                    className={`absolute bottom-[1%] right-[0.1%] w-[23%] h-[27%] bg-transparent rounded-2xl ${
                      bossResult !== null
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  />
                </div>
              )}

              {step >= 2 && (
                <>
                  {!bossShowEndScreen && (
                    <img
                      src={bossMsgImg}
                      alt="Boss Message"
                      className="absolute top-[87px] left-[186px] w-[353.65px] animate-slide-up"
                    />
                  )}

                  {step >= 2 && step < 8 && (
                    <img
                      src={prepare}
                      alt="Prepare"
                      className="absolute top-[165px] left-[404px] h-[80.17px] animate-slide-up"
                    />
                  )}

                  {bossDigitIndex >= 0 && !bossShowEndScreen && (
                    <img
                      key={`boss-digit-${bossDigitIndex}`}
                      src={`/figma-assets/game4/${BOSS_TARGET_NUMBER[bossDigitIndex]}-boss.png`}
                      alt="Boss Digit"
                      className="absolute top-[165px] left-[404px] h-[77.33px] z-50 animate-slide-up"
                    />
                  )}

                  {bossShowEndScreen && (
                    <img
                      src={resultTextImg}
                      alt="ทำได้ไม่เท่ากับดี"
                      className="absolute top-[99px] left-[224.48px] w-[677.72px] z-[50] animate-fade-in"
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}