import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useNavigate } from "react-router-dom";
import ExitButton from "../components/ExitButton";

import {
  imgBoss,
  imgBoss2,
  imgBoss3,
  imgFoldedShirts,
  imgLaptop,
  imgMusicPlayerAlbumArt,
  imgMusicPlayerAlbumArt2,
  imgMusicPlayerPanel,
  imgMusicPlayerPlayIcon,
  imgMusicPlayerScrubber,
  imgMusicPlayerSkipIcon,
  imgMusicPlayerSpeakerIcon,
  imgNotificationAvatar,
  imgNotificationCardBackground,
  imgNotificationMessageText,
  imgNotificationTitleText,
  imgPattern,
  imgRepeatSamLarge,
  imgRepeatSamMedium,
  imgRepeatSamSmall,
  imgRepeatSamTiny1,
  imgRepeatSamTiny2,
  imgSoapBar,
  imgTextKueIs,
  imgThaiTypographySpritesheet,
  imgTitleAutomaticActivity,
  imgToothbrush,
  imgBossCorrect,
  imgBossWrong,
  imgNotificationHover,
  imgMusicPlayerPause,
  imgMaiWhai,
  imgMaiWhai2,
  imgListenMusic,
  imgListenNoMusic,
  imgCanDo,
  imgHeadphone,
  imgChat1,
  imgChat2,
  imgChat3,
  imgBossStickerNoti,
} from "./game2Assets";

const W = 1920;
const H = 4320;

const STEP_DATA: Record<
  number,
  { answer: string; bossImg: string; chatImg: string }
> = {
  1: { answer: "สะดวกมากครับ", bossImg: imgBoss, chatImg: imgChat1 },
  2: { answer: "ไหวชิวครับ", bossImg: imgBoss2, chatImg: imgChat2 },
  3: { answer: "สะบายครับ", bossImg: imgBoss3, chatImg: imgChat3 },
};

function useGame2Scale() {
  const [scale, setScale] = useState(1);

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

function PiroteNotificationCard({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`${className ?? "relative h-[160.06px] w-[540.14px]"} transition-transform duration-200 cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {isHovered ? (
        <img
          alt="Notification Hover"
          className="absolute max-w-none w-[570px] h-auto bottom-[-20px] right-[-20px] object-contain"
          src={imgNotificationHover}
        />
      ) : (
        <>
          <img
            alt="Notification Background"
            className="absolute block size-full max-w-none"
            src={imgNotificationCardBackground}
          />
          <div className="absolute inset-[57.29%_3.76%_18.12%_25.37%]">
            <img
              alt="Message"
              className="absolute block size-full max-w-none"
              src={imgNotificationMessageText}
            />
          </div>
          <div className="absolute inset-[24.05%_49.53%_55.6%_25.47%]">
            <img
              alt="Title"
              className="absolute block size-full max-w-none"
              src={imgNotificationTitleText}
            />
          </div>
          <div className="absolute inset-[7.16%_76.22%_13.5%_3.04%] flex items-center justify-center overflow-hidden rounded-[20px]">
            <div className="flex h-[126.99px] w-[112.05px] flex-none -scale-y-100 rotate-180 items-center justify-center">
              <div className="relative size-full">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <img
                    alt="Avatar"
                    className="absolute left-0 top-0 size-full max-w-none"
                    src={imgNotificationAvatar}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Game2Artboard() {
  const navigate = useNavigate();

  const tf = {
    "--transform-inner-width": "1200",
    "--transform-inner-height": "19",
  } as CSSProperties;

  // states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isNextSong, setIsNextSong] = useState(false);
  const [songProgress, setSongProgress] = useState(0);

  const [currentStep, setCurrentStep] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [feedbackState, setFeedbackState] = useState<
    "correct" | "wrong" | null
  >(null);
  const [gifBuster, setGifBuster] = useState("");

  const [isClicked, setIsClicked] = useState(false);
  const [showChatContent, setShowChatContent] = useState(false);
  const [blinkMaiWhai, setBlinkMaiWhai] = useState(false);

  const [isLaptopVisible, setIsLaptopVisible] = useState(false);
  const [hasInteractedWithMusic, setHasInteractedWithMusic] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const laptopSectionRef = useRef<HTMLDivElement>(null);
  const isFirstNotiTriggered = useRef(false);

  const currentData = STEP_DATA[currentStep] || STEP_DATA[3];

  // effects
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLaptopVisible) {
          setIsLaptopVisible(true);
        }
      },
      { threshold: 0.5 },
    );

    if (laptopSectionRef.current) {
      observer.observe(laptopSectionRef.current);
    }
    return () => observer.disconnect();
  }, [isLaptopVisible]);

  useEffect(() => {
    if (
      isLaptopVisible &&
      hasInteractedWithMusic &&
      !isFirstNotiTriggered.current &&
      currentStep === 1
    ) {
      isFirstNotiTriggered.current = true;
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isLaptopVisible, hasInteractedWithMusic, currentStep]);

  useEffect(() => {
    const audio = new Audio("/happy-sound.mp3");
    audio.loop = true;
    audio.volume = 0.2;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration && audio.duration !== Infinity) {
        setSongProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.src = isNextSong ? "/sad-sound.mp3" : "/happy-sound.mp3";
    audioRef.current.load();
    audioRef.current.currentTime = 0;

    setSongProgress(0);

    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    }
  }, [isNextSong, isPlaying]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (currentStep === 4) {
      interval = setInterval(() => setBlinkMaiWhai((prev) => !prev), 500);
    }
    return () => clearInterval(interval);
  }, [currentStep]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isClicked) {
      timer = setTimeout(() => setShowChatContent(true), 500);
    } else {
      setShowChatContent(false);
    }
    return () => clearTimeout(timer);
  }, [isClicked]);

  const handleFeedbackClick = useCallback(() => {
    setFeedbackState(null);
    setInputValue("");
    setIsClicked(false);
    setShowChatContent(false);

    setTimeout(() => {
      if (currentStep < 3) {
        setCurrentStep((prev) => prev + 1);
        setTimeout(() => setIsClicked(true), 50);
      } else {
        setCurrentStep(4);
      }
    }, 50);
  }, [currentStep]);

  useEffect(() => {
    let autoAdvanceTimer: ReturnType<typeof setTimeout>;

    if (feedbackState) {
      autoAdvanceTimer = setTimeout(() => {
        handleFeedbackClick();
      }, 2000);
    }

    return () => clearTimeout(autoAdvanceTimer);
  }, [feedbackState, handleFeedbackClick]);

  // handlers
  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    setHasInteractedWithMusic(true);

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSkipSong = () => {
    setHasInteractedWithMusic(true);
    setIsNextSong((prev) => !prev);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    setHasInteractedWithMusic(true);

    const newProgress = parseFloat(e.target.value);
    setSongProgress(newProgress);
    const duration = audioRef.current.duration || 60;
    audioRef.current.currentTime = (newProgress / 100) * duration;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputValue.trim() === currentData.answer) {
      setFeedbackState("correct");
    } else {
      setFeedbackState("wrong");
    }
    setGifBuster(`?t=${Date.now()}`);
  };

  const handleNavigateNext = () => {
    if ("startViewTransition" in document) {
      (document as any).startViewTransition(() => {
        navigate("/game3");
      });
    } else {
      navigate("/game3");
    }
  };

  // variables
  let finalFeedbackSrc = "";
  if (feedbackState) {
    const baseSrc = feedbackState === "correct" ? imgBossCorrect : imgBossWrong;
    finalFeedbackSrc = baseSrc.startsWith("data:")
      ? baseSrc
      : `${baseSrc}${gifBuster}`;
  }

  return (
    <section className="relative h-[4320px] w-[1920px] overflow-hidden bg-[#7DC3EF] text-left">
      <div className="absolute contents left-0 top-0">
        <div className="absolute left-0 top-0 h-[4320px] w-[1920px] bg-[#7DC3EF]" />

        {/* background decorations */}
        <div className="absolute contents left-0 top-[2160px]">
          <div className="absolute contents left-[1420px] top-[2160px]">
            <div className="absolute left-[1729px] top-[2295px] h-[52px] w-[191px] bg-white" />
            <div className="absolute left-[1612px] top-[2345px] h-[50px] w-[117px] bg-white" />
            <div className="absolute left-[1617px] top-[2201px] h-[57px] w-[146px] bg-white" />
            <div className="absolute left-[1545px] top-[2160px] h-[30px] w-[58px] bg-white" />
            <div className="absolute left-[1859px] top-[2220px] h-[59px] w-[61px] bg-white" />
            <div className="absolute left-[1522px] top-[2313px] h-[16px] w-[55px] bg-white" />
            <div className="absolute left-[1420px] top-[2356px] h-[31px] w-[52px] bg-white" />
          </div>
          <div className="absolute contents left-0 top-[2560px]">
            <div className="absolute left-0 top-[2608px] flex h-[52px] w-[191px] items-center justify-center">
              <div className="flex-none rotate-180">
                <div className="h-[52px] w-[191px] bg-white" />
              </div>
            </div>
            <div className="absolute left-[191px] top-[2560px] flex h-[50px] w-[117px] items-center justify-center">
              <div className="flex-none rotate-180">
                <div className="h-[50px] w-[117px] bg-white" />
              </div>
            </div>
            <div className="absolute left-[157px] top-[2697px] flex h-[57px] w-[146px] items-center justify-center">
              <div className="flex-none rotate-180">
                <div className="h-[57px] w-[146px] bg-white" />
              </div>
            </div>
            <div className="absolute left-[317px] top-[2765px] flex h-[30px] w-[58px] items-center justify-center">
              <div className="flex-none rotate-180">
                <div className="h-[30px] w-[58px] bg-white" />
              </div>
            </div>
            <div className="absolute left-0 top-[2676px] flex h-[59px] w-[61px] items-center justify-center">
              <div className="flex-none rotate-180">
                <div className="h-[59px] w-[61px] bg-white" />
              </div>
            </div>
            <div className="absolute left-[343px] top-[2626px] flex h-[16px] w-[55px] items-center justify-center">
              <div className="flex-none rotate-180">
                <div className="h-[16px] w-[55px] bg-white" />
              </div>
            </div>
            <div className="absolute left-[448px] top-[2568px] flex h-[31px] w-[52px] items-center justify-center">
              <div className="flex-none rotate-180">
                <div className="h-[31px] w-[52px] bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-[8.19%_-10.68%_70.31%_39.38%]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            alt=""
            className="absolute left-0 top-0 size-full max-w-none"
            src={imgFoldedShirts}
          />
        </div>
      </div>

      <div
        className="absolute left-[-449px] top-[704px] flex h-[1123.446px] w-[1162.158px] items-center justify-center"
        style={tf}
      >
        <div className="flex-none rotate-[49.06deg]">
          <div className="relative h-[1003.201px] w-[617.04px]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <img
                alt=""
                className="absolute -left-[92.55%] -top-[5.4%] h-[109.98%] w-[317.88%] max-w-none"
                src={imgToothbrush}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute contents left-[129px] top-[82px]">
        <div className="absolute inset-[2.66%_56.81%_92.71%_6.72%] flex items-center justify-center">
          <div className="h-[127.36px] w-[690.717px] flex-none rotate-[-6.08deg]">
            <div className="relative size-full">
              <div className="absolute inset-[-1.11%_-0.21%_-1.18%_-0.21%]">
                <img
                  alt=""
                  className="block size-full max-w-none"
                  src={imgTitleAutomaticActivity}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-[853px] top-[82px] h-[272px] w-[314px]">
          <img
            alt=""
            className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
            src={imgTextKueIs}
          />
        </div>
        <div className="absolute contents left-[829px] top-[383px]">
          <div className="absolute left-[829px] top-[383px] h-[63px] w-[326px]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <img
                alt=""
                className="absolute left-0 top-[-0.02%] h-[344.49%] w-[159.2%] max-w-none"
                src={imgThaiTypographySpritesheet}
              />
            </div>
          </div>
          <div className="absolute left-[1135px] top-[402px] h-[120px] w-[272px]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <img
                alt=""
                className="absolute left-[-227.97%] top-[-0.02%] h-[344.49%] w-[362.94%] max-w-none"
                src={imgThaiTypographySpritesheet}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute contents left-[221px] top-[939px]">
        <div className="absolute left-[221px] top-[1098px] h-[79px] w-[281px]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <img
              alt=""
              className="absolute left-0 top-[-77.23%] h-[274.72%] w-[184.7%] max-w-none"
              src={imgThaiTypographySpritesheet}
            />
          </div>
        </div>
        <div className="absolute left-[272px] top-[1148px] h-[127px] w-[370px]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <img
              alt=""
              className="absolute left-[-125.65%] top-[-77.23%] h-[274.72%] w-[225.65%] max-w-none"
              src={imgThaiTypographySpritesheet}
            />
          </div>
        </div>
        <div className="absolute contents inset-[21.74%_43.43%_65.91%_21.46%]">
          <div className="absolute inset-[27.96%_43.43%_65.91%_36.68%]">
            <img
              alt=""
              className="absolute block size-full max-w-none"
              src={imgRepeatSamLarge}
            />
          </div>
          <div className="absolute inset-[28.11%_64.55%_68.96%_25.91%]">
            <img
              alt=""
              className="absolute block size-full max-w-none"
              src={imgRepeatSamMedium}
            />
          </div>
          <div className="absolute inset-[24.55%_61.17%_73.07%_31.11%]">
            <img
              alt=""
              className="absolute block size-full max-w-none"
              src={imgRepeatSamSmall}
            />
          </div>
          <div className="absolute inset-[21.74%_69.42%_76.42%_24.59%]">
            <img
              alt=""
              className="absolute block size-full max-w-none"
              src={imgRepeatSamTiny1}
            />
          </div>
          <div className="absolute inset-[23.13%_74.17%_75.52%_21.46%]">
            <img
              alt=""
              className="absolute block size-full max-w-none"
              src={imgRepeatSamTiny2}
            />
          </div>
        </div>
      </div>

      <div className="absolute left-[75px] top-[1342px] h-[342px] w-[670px] overflow-clip">
        <div className="absolute inset-[0_0.52%_0.52%_0]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <img
              alt=""
              className="absolute left-0 top-0 size-full max-w-none"
              src={imgSoapBar}
            />
          </div>
        </div>
      </div>

      <div className="absolute contents left-[779px] top-[1538px]">
        <div className="absolute right-[85px] top-[1538px] w-[1056px]">
          <img
            alt="รูปภาพแพทเทิร์น"
            className="block size-full max-w-none object-contain"
            src={imgPattern}
          />
        </div>
      </div>

      <div
        ref={laptopSectionRef}
        className="absolute top-[2500px] left-0 right-0 h-[1000px] pointer-events-none"
      />

      <div className="absolute left-[331px] top-[3181px] h-[161.06px] w-[541.14px] z-10">
        <div className="absolute inset-0 contents">
          <img
            alt=""
            className="absolute block size-full max-w-none"
            src={imgMusicPlayerPanel}
          />
          <div className="absolute top-[22.72px] left-[36.46px] w-auto h-[29.46px] flex items-center">
            <img
              alt="Album Art"
              className="block w-full h-full object-contain object-left"
              src={
                isNextSong ? imgMusicPlayerAlbumArt2 : imgMusicPlayerAlbumArt
              }
            />
          </div>

          <div className="absolute inset-[43.28%_9.19%_56.1%_6.96%]">
            <img
              alt=""
              className="absolute block size-full max-w-none pointer-events-none"
              src={imgMusicPlayerScrubber}
            />
            <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-[5px] h-[24px] bg-white z-1" />
            <div className="absolute top-[50%] left-0 w-full h-[20px] -translate-y-1/2 flex items-center z-10">
              <div className="absolute left-0 w-full h-[2px]">
                <div
                  className="absolute top-1/2 h-[20px] w-[3px] bg-black -translate-y-1/2 -translate-x-1/2 pointer-events-none"
                  style={{ left: `${songProgress}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={songProgress || 0}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 appearance-none bg-transparent"
              />
            </div>
          </div>

          <div className="absolute inset-[37.58%_92.78%_50.41%_6.7%]">
            <img
              alt=""
              className="absolute block size-full max-w-none"
              src={imgMusicPlayerSpeakerIcon}
            />
          </div>

          <button
            type="button"
            className="absolute bottom-[21.83px] left-[39.47px] w-[48px] h-[48px] block cursor-pointer transition-transform hover:scale-105 active:scale-100 z-10"
            onClick={handleTogglePlay}
          >
            <img
              alt={isPlaying ? "Pause" : "Play"}
              className="block w-full h-full object-contain"
              src={isPlaying ? imgMusicPlayerPause : imgMusicPlayerPlayIcon}
            />
          </button>
        </div>
        <button
          type="button"
          className="absolute bottom-[34.65px] left-[109.78px] w-[21px] h-[23px] block cursor-pointer transition-transform hover:scale-105 active:scale-100 z-10"
          onClick={handleSkipSong}
        >
          <img
            alt="Skip"
            className="block w-full h-full object-contain"
            src={imgMusicPlayerSkipIcon}
          />
        </button>
      </div>

      {currentStep < 4 && (
        <>
          <div
            className={`absolute left-[819px] top-[2654px] z-10 transform ${
              isClicked
                ? "translate-y-0 opacity-100 transition-all duration-700 ease-[cubic-bezier(0.2,1.2,0.4,1)]"
                : "translate-y-[50px] opacity-0 transition-none pointer-events-none"
            }`}
          >
            <img
              alt="Boss"
              className={`absolute left-[0px] top-[0px] block w-[535.45px] max-w-none z-0 transform ${
                feedbackState
                  ? "opacity-0 transition-none"
                  : showChatContent
                    ? "translate-y-0 opacity-100 transition-all duration-700 ease-[cubic-bezier(0.2,1.2,0.4,1)]"
                    : "translate-y-[50px] opacity-0 transition-none"
              }`}
              src={currentData.bossImg}
            />

            <div className="absolute left-[221px] top-[189px] w-[540.14px] h-[496.77px] z-10">
              <img
                src={currentData.chatImg}
                alt="Chat Message"
                className="absolute inset-0 w-full h-full object-contain"
              />

              <form
                onSubmit={handleSubmit}
                className="absolute bottom-[4px] left-[6px] w-[531px] h-[85px] flex z-20 overflow-hidden rounded-[20px]"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className={`flex-1 h-full px-6 outline-none text-[31px] font-light transition-colors ${
                    inputValue
                      ? "bg-[#D00A7D] text-white"
                      : "bg-transparent text-transparent caret-white"
                  }`}
                />
                <button
                  type="submit"
                  className="w-[125px] h-[250px] bg-transparent cursor-pointer transition-colors"
                />
              </form>
            </div>
          </div>

          <div
            className={`absolute left-[1063px] z-10 transition-all duration-700 ease-[cubic-bezier(0.2,1.2,0.4,1)] ${
              showNotification && !isClicked
                ? "top-[2578px] opacity-100"
                : "top-[2678px] opacity-0 pointer-events-none"
            }`}
          >
            <PiroteNotificationCard
              className="block h-[160.06px] w-[540.14px]"
              onClick={() => {
                setIsClicked(true);
                setShowNotification(false);
              }}
            />
          </div>

          <div
            className={`absolute left-[1053px] top-[2578px] z-[101] transform ${
              feedbackState
                ? "translate-y-0 opacity-100 transition-all duration-700 ease-[cubic-bezier(0.2,1.2,0.4,1)]"
                : "translate-y-[50px] opacity-0 transition-none pointer-events-none"
            }`}
          >
            <img
              src={imgBossStickerNoti}
              alt="Boss Sent Sticker"
              className="w-[540.14px] object-contain"
            />
          </div>
        </>
      )}

      {currentStep === 4 && (
        <div className="absolute left-0 top-0 h-full w-full z-20 pointer-events-none">
          <img
            src={imgListenMusic}
            alt="ฟังเพลง"
            className="absolute right-[78.37px] bottom-[1291.6px] w-[616.63px] object-contain z-20"
          />
          <img
            src={imgListenNoMusic}
            alt="แบบไม่มีเนื้อร้อง"
            className="absolute left-[230px] top-[2446px] w-[1159.55px] object-contain"
          />
          <img
            src={imgCanDo}
            alt="สามารถทำได้..."
            className="absolute right-[320.65px] bottom-[1076.9px] w-[881.35px] object-contain"
          />
          <img
            src={imgHeadphone}
            alt="หูฟัง"
            className="absolute left-[1268.2px] bottom-[1076.98px] w-[654px] object-contain z-19"
          />

          <div
            className="absolute left-[404px] bottom-[585px] w-[1120px] flex flex-col items-center justify-center cursor-pointer pointer-events-auto transition-transform hover:scale-105 active:scale-100"
            onClick={handleNavigateNext}
          >
            <img
              src={blinkMaiWhai ? imgMaiWhai2 : imgMaiWhai}
              alt="ไหวไม่ไหว ก็ไปกันต่อ"
              className="w-full object-contain transition-opacity duration-100"
            />
            <img
              src="/figma-assets/multi/click-animation.png"
              alt="cursor"
              className="absolute bottom-[-350px] right-[-592px] h-[1050px] w-auto max-w-none object-contain pointer-events-none"
            />
          </div>
        </div>
      )}

      {feedbackState && (
        <div
          className="absolute left-[287px] top-[2544px] w-[1347px] h-[854px] z-[102] bg-black/5 cursor-pointer pointer-events-auto"
          onClick={handleFeedbackClick}
        >
          <img
            key={gifBuster}
            src={finalFeedbackSrc}
            alt={feedbackState === "correct" ? "Correct!" : "Wrong!"}
            className={`absolute max-w-none object-contain transition-transform ${
              feedbackState === "correct"
                ? "left-[-390px] bottom-[-201px] w-[2200px]"
                : "left-[-450px] bottom-[-180px] w-[2200px]"
            }`}
          />
        </div>
      )}

      <div className="absolute left-[114.5px] top-[2505px] h-[1109.97px] w-[1690.47px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            alt="Laptop"
            className="absolute left-0 top-0 size-full max-w-none"
            src={imgLaptop}
          />
        </div>
      </div>
    </section>
  );
}

export function Game2Page() {
  const scale = useGame2Scale();

  return (
    <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[#0d0d0d]">
      <style>{`
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation-duration: 0.8s; 
          mix-blend-mode: normal;
        }
      `}</style>
      
      <ExitButton mode="fixed" />

      <div
        className="relative mx-auto shrink-0"
        style={{
          width: W * scale,
          height: H * scale,
        }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left will-change-transform"
          style={{
            width: W,
            height: H,
            transform: `scale(${scale})`,
          }}
        >
          <Game2Artboard />
        </div>
      </div>
    </div>
  );
}
