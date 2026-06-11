import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  imgTopBadge,
  imgStickerA,
  imgStickerB,
  imgStickerC,
  imgBannerMid,
  imgBg,
  imgGroup,
  imgGroup1,
  imgGroup2,
  imgGroup3,
  imgGroup4,
  imgGroup5,
  imgGroup6,
  imgGroup7,
  imgGroup8,
  imgGroup9,
  imgGroup10,
  imgGroup11,
  imgGroup12,
  imgGroup13,
  imgGroup14,
  imgGroup15,
  imgGroup16,
  imgGroup17,
  imgGroup18,
  imgGroup19,
  imgGroup20,
  imgGroup21,
  imgGroup22,
  imgGroup23,
  imgGroup24,
  imgGroup25,
  imgGroup26,
  imgGroup27,
  imgGroup28,
  imgGroup29,
  imgGroup30,
  imgGroup31,
  imgGroup32,
  imgGroup33,
  imgMulti1,
  imgRectangle,
  imgVector,
  imgWfh,
  imgExpectation,
  imgPressure,
} from "./introAssets";

const PRESSURE_ROW_INSETS = [
  "inset-[13.19%_42.24%_85.65%_42.19%]",
  "inset-[14.49%_42.24%_84.35%_42.19%]",
  "inset-[15.79%_42.24%_83.06%_42.19%]",
  "inset-[17.08%_42.24%_81.76%_42.19%]",
  "inset-[18.38%_42.24%_80.46%_42.19%]",
  "inset-[19.68%_42.24%_79.17%_42.19%]",
  "inset-[20.97%_42.24%_77.87%_42.19%]",
  "inset-[22.27%_42.24%_76.57%_42.19%]",
  "inset-[23.56%_42.24%_75.28%_42.19%]",
  "inset-[24.86%_42.24%_73.98%_42.19%]",
  "inset-[26.16%_42.24%_72.69%_42.19%]",
  "inset-[27.45%_42.24%_71.39%_42.19%]",
  "inset-[28.75%_42.24%_70.09%_42.19%]",
  "inset-[30.05%_42.24%_68.8%_42.19%]",
  "inset-[31.34%_42.24%_67.5%_42.19%]",
  "inset-[32.64%_42.24%_66.2%_42.19%]",
  "inset-[33.94%_42.24%_64.91%_42.19%]",
  "inset-[35.23%_42.24%_63.61%_42.19%]",
  "inset-[36.53%_42.24%_62.31%_42.19%]",
  "inset-[37.82%_42.24%_61.02%_42.19%]",
  "inset-[39.12%_42.24%_59.72%_42.19%]",
  "inset-[40.42%_42.24%_58.43%_42.19%]",
  "inset-[41.71%_42.24%_57.13%_42.19%]",
  "inset-[43.01%_42.24%_55.83%_42.19%]",
  "inset-[44.31%_42.24%_54.54%_42.19%]",
  "inset-[45.6%_42.24%_53.24%_42.19%]",
  "inset-[46.9%_42.24%_51.94%_42.19%]",
  "inset-[48.19%_42.24%_50.65%_42.19%]",
  "inset-[49.49%_42.24%_49.35%_42.19%]",
] as const;

function DecorativeGroup({ className }: { className: string }) {
  return (
    <div className={`absolute overflow-clip ${className}`}>
      <div className="absolute inset-[0_46.56%_84.75%_0]">
        <img
          alt=""
          className="absolute block size-full max-w-none"
          src={imgGroup}
        />
      </div>
      <div className="absolute inset-[14.39%_0_0_0]">
        <img
          alt=""
          className="absolute block size-full max-w-none"
          src={imgGroup1}
        />
      </div>
      <div className="absolute inset-[26.33%_0_0_0]">
        <img
          alt=""
          className="absolute block size-full max-w-none"
          src={imgGroup2}
        />
      </div>
    </div>
  );
}

function ScrollReveal({
  children,
  animationClass,
  threshold = 0.15,
  alwaysMonitor = true,
  customTransitionClass = "transition-all duration-500 ease-out",
}: {
  children: ReactNode;
  animationClass: string;
  threshold?: number;
  alwaysMonitor?: boolean;
  customTransitionClass?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else if (alwaysMonitor) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "-50px 0px -50px 0px" },
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [threshold, alwaysMonitor]);

  return (
    <div
      ref={elementRef}
      className={`${customTransitionClass} h-full w-full ${isVisible ? animationClass : "opacity-0 pointer-events-none"}`}
    >
      {children}
    </div>
  );
}

export function IntroPage({ onMultiClick }: { onMultiClick: () => void }) {
  const topTriggerRef = useRef<HTMLDivElement>(null);
  const bottomTriggerRef = useRef<HTMLDivElement>(null);

  const momWordsRef = useRef<HTMLDivElement>(null);
  const pressureRef = useRef<HTMLDivElement>(null);
  const bossNotiRef = useRef<HTMLDivElement>(null);
  const pabDeawRef = useRef<HTMLDivElement>(null);

  // first animation
  useEffect(() => {
    let timeoutId: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          momWordsRef.current?.classList.add("mom-words-active");
          timeoutId = window.setTimeout(() => {
            pressureRef.current?.classList.add("pressure-smash-active");
          }, 400);
        } else {
          momWordsRef.current?.classList.remove("mom-words-active");
          pressureRef.current?.classList.remove("pressure-smash-active");
          if (timeoutId) window.clearTimeout(timeoutId);
        }
      },
      { threshold: 0, rootMargin: "-45% 0px -45% 0px" },
    );
    if (topTriggerRef.current) observer.observe(topTriggerRef.current);

    return () => {
      observer.disconnect();
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  // second animation
  useEffect(() => {
    let pabdeawTimeoutId: number | undefined;
    const bottomObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          bossNotiRef.current?.classList.add("boss-noti-active");
          pabdeawTimeoutId = window.setTimeout(() => {
            pabDeawRef.current?.classList.add("pabdeaw-active");
          }, 300);
        } else {
          bossNotiRef.current?.classList.remove("boss-noti-active");
          pabDeawRef.current?.classList.remove("pabdeaw-active");
          if (pabdeawTimeoutId) window.clearTimeout(pabdeawTimeoutId);
        }
      },
      { threshold: 0, rootMargin: "-45% 0px -45% 0px" },
    );
    if (bottomTriggerRef.current)
      bottomObserver.observe(bottomTriggerRef.current);

    return () => {
      bottomObserver.disconnect();
      if (pabdeawTimeoutId) window.clearTimeout(pabdeawTimeoutId);
    };
  }, []);

  const handleTransitionClick = () => {
    // @ts-ignore
    if (document.startViewTransition) {
      // @ts-ignore
      document.startViewTransition(() => {
        onMultiClick();
      });
    } else {
      onMultiClick();
    }
  };

  return (
    <div className="relative h-[4320px] w-[1920px] shrink-0 bg-white text-left overflow-hidden">
      <style>{`
        @keyframes pureFade { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
        .animate-pure-fade { animation: pureFade 3s ease-in-out infinite; }
        
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation-duration: 0.5s;
          mix-blend-mode: normal;
        }

        .mom-words-container, .pressure-smash-effect, .boss-noti-container, .pabdeaw-container {
          will-change: transform, opacity;
        }

        .mom-words-container {
          opacity: 0; transform: scale(0.2); transform-origin: 50% 38%; 
          transition: transform 250ms cubic-bezier(0.2, 1.6, 0.4, 1), opacity 150ms ease-out;
        }
        .mom-words-active { opacity: 1 !important; transform: scale(1) !important; }
        
        .pressure-smash-effect {
          opacity: 0; transform: scale(0.5) translateY(100px); transform-origin: center bottom;
          transition: transform 400ms cubic-bezier(0.25, 1.8, 0.35, 0.85), opacity 250ms ease-out;
        }
        .pressure-smash-active { opacity: 1 !important; transform: scale(1) translateY(0px) !important; }

        .boss-noti-container {
          opacity: 0; transform: scale(0.2); transform-origin: 73% 59%; 
          transition: transform 220ms cubic-bezier(0.2, 1.6, 0.4, 1), opacity 150ms ease-out;
        }
        .boss-noti-active { opacity: 1 !important; transform: scale(1) !important; }

        .pabdeaw-container {
          opacity: 0; transform: scale(0.2) rotate(-15deg); transform-origin: 84% 62%; 
          transition: transform 250ms cubic-bezier(0.2, 1.6, 0.4, 1), opacity 150ms ease-out;
        }
        .pabdeaw-active { opacity: 1 !important; transform: scale(1) rotate(0deg) !important; }
      `}</style>

      {/* background */}
      <div className="absolute left-[304px] top-[208px] h-[109px] w-[368px]">
        <img
          alt=""
          className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
          src={imgTopBadge}
        />
      </div>
      <div className="absolute left-[320px] top-[171px] h-[4149px] w-[1266px]">
        <img
          alt=""
          className="absolute block size-full max-w-none"
          src={imgBg}
        />
      </div>
      <div className="absolute inset-[6.46%_35.42%_88.63%_35.47%]">
        <img
          alt=""
          className="absolute block size-full max-w-none"
          src={imgWfh}
        />
      </div>

      {/* decorative groups */}
      <div className="absolute contents left-[1375px] top-[1292px]">
        <DecorativeGroup className="left-[1375px] top-[1375px] h-[168px] w-[210px]" />
        <DecorativeGroup className="left-[1494px] top-[1292px] h-[168px] w-[210px]" />
      </div>

      <div className="absolute contents left-[1360px] top-[2563px]">
        <DecorativeGroup className="left-[1360px] top-[2646px] h-[168px] w-[210px]" />
        <DecorativeGroup className="left-[1479px] top-[2563px] h-[168px] w-[210px]" />
      </div>

      <div className="absolute contents inset-[39.1%_66.56%_52.64%_8.07%]">
        <DecorativeGroup className="inset-[43.47%_66.56%_52.64%_22.5%]" />
        <DecorativeGroup className="inset-[41.02%_80.99%_55.09%_8.07%]" />
        <DecorativeGroup className="inset-[39.1%_74.79%_57.01%_14.27%]" />
      </div>

      <div className="absolute contents inset-[18.19%_66.56%_73.54%_8.07%]">
        <DecorativeGroup className="inset-[22.57%_66.56%_73.54%_22.5%]" />
        <DecorativeGroup className="inset-[20.12%_80.99%_76%_8.07%]" />
        <DecorativeGroup className="inset-[18.19%_74.79%_77.92%_14.27%]" />
      </div>

      <div className="absolute contents inset-[61.92%_72.81%_32.27%_10.05%]">
        <DecorativeGroup className="inset-[63.84%_79.01%_32.27%_10.05%]" />
        <DecorativeGroup className="inset-[61.92%_72.81%_34.19%_16.25%]" />
      </div>

      <div className="absolute contents inset-[13.19%_42.24%_49.35%_42.19%]">
        {PRESSURE_ROW_INSETS.map((inset) => (
          <div key={inset} className={`absolute ${inset}`}>
            <img
              alt=""
              className="absolute block size-full max-w-none"
              src={imgGroup3}
            />
          </div>
        ))}
      </div>

      <div className="absolute left-[1022px] top-[405px] flex h-[271.055px] w-[770.93px] items-center justify-center">
        <div className="flex-none rotate-[7.06deg]">
          <div className="relative h-[179.681px] w-[754.568px]">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              src={imgStickerA}
            />
          </div>
        </div>
      </div>

      <div className="absolute left-[378px] top-[3559px] flex h-[115.222px] w-[570.521px] items-center justify-center">
        <div className="flex-none -rotate-[3.04deg]">
          <div className="relative h-[85.309px] w-[566.797px]">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              src={imgStickerB}
            />
          </div>
        </div>
      </div>

      <div className="absolute left-[831px] top-[3995px] flex h-[152.843px] w-[493.912px] items-center justify-center">
        <div className="flex-none rotate-[5.23deg]">
          <div className="relative h-[109px] w-[486px]">
            <img
              src={imgStickerC}
              alt=""
              className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
            />
          </div>
        </div>
      </div>

      <div className="absolute left-[5.21%] right-[40.53%] top-[2240px] flex aspect-[1041.9047242528677/319.61309129812435] items-center justify-center">
        <div className="flex-none h-[179.68px] w-[1026.937px] -rotate-[7.93deg]">
          <div className="relative size-full">
            <img
              alt=""
              className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
              src={imgBannerMid}
            />
          </div>
        </div>
      </div>

      {/* effect and animation trigger */}
      <div
        ref={pressureRef}
        className="absolute left-0 top-[1010px] w-full z-20 pressure-smash-effect"
      >
        <img
          alt="ความกดดัน"
          className="pointer-events-none block w-full max-w-none object-cover"
          src={imgPressure}
        />
      </div>

      <div className="absolute left-[0px] top-[2870px] w-[1910px]">
        <ScrollReveal
          animationClass="animate-pure-fade"
          threshold={0.1}
          alwaysMonitor={true}
        >
          <img
            alt="ความคาดหวัง"
            className="pointer-events-none block w-full max-w-none object-contain"
            src={imgExpectation}
          />
        </ScrollReveal>
      </div>

      <div
        ref={topTriggerRef}
        className="absolute left-[1375px] top-[1000px] w-10 h-[1400px] pointer-events-none"
      />
      <div
        ref={bottomTriggerRef}
        className="absolute left-[900px] top-[2200px] w-10 h-[1000px] pointer-events-none"
      />

      {/* mom's message */}
      <div className="absolute left-0 top-0 w-[1920px] h-[4320px] pointer-events-none">
        <div
          ref={momWordsRef}
          className="absolute inset-0 size-full mom-words-container"
        >
          <div className="absolute inset-0 size-full">
            <div className="absolute inset-[35.39%_53.38%_59.46%_5.52%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup4}
              />
            </div>
            <div className="absolute inset-[38.54%_89.96%_60.07%_6.89%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup5}
              />
            </div>
            <div className="absolute inset-[38.35%_87.61%_60.17%_10.33%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup6}
              />
            </div>
            <div className="absolute inset-[37.96%_83.2%_60.28%_12.73%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup7}
              />
            </div>
            <div className="absolute inset-[37.45%_84.43%_61.87%_14.74%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup8}
              />
            </div>
            <div className="absolute inset-[38.15%_81.8%_60.26%_15.26%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup9}
              />
            </div>
            <div className="absolute inset-[37.99%_78.44%_60.53%_18.42%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup10}
              />
            </div>
            <div className="absolute inset-[37.53%_75.92%_60.66%_21.69%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup11}
              />
            </div>
            <div className="absolute inset-[37.52%_72%_60.8%_24.2%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup12}
              />
            </div>
            <div className="absolute inset-[36.6%_71.88%_62.66%_27.22%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup13}
              />
            </div>
            <div className="absolute inset-[37.07%_67.08%_60.6%_28.14%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup14}
              />
            </div>
            <div className="absolute inset-[36.99%_62.58%_61.19%_33.14%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup15}
              />
            </div>
            <div className="absolute inset-[36%_62.3%_63.2%_36.73%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup16}
              />
            </div>
            <div className="absolute inset-[36.88%_58.61%_61.34%_37.51%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup17}
              />
            </div>
            <div className="absolute inset-[36.74%_54.75%_61.49%_41.48%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup18}
              />
            </div>
          </div>
          <div className="absolute inset-0 size-full">
            <div className="absolute inset-[38.23%_43.88%_57.78%_36.07%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup19}
              />
            </div>
            <div className="absolute inset-[39.8%_44.78%_58.22%_53.39%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup20}
              />
            </div>
            <div className="absolute inset-[39.63%_60.87%_58.85%_36.96%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup21}
              />
            </div>
            <div className="absolute inset-[39.41%_56.83%_58.74%_39.2%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup22}
              />
            </div>
            <div className="absolute inset-[38.64%_54.14%_60.52%_40.42%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup23}
              />
            </div>
            <div className="absolute inset-[40.03%_54.12%_58.59%_42.53%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup24}
              />
            </div>
            <div className="absolute inset-[40.37%_53.29%_58.5%_45.67%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup25}
              />
            </div>
            <div className="absolute inset-[40.5%_51.18%_58.41%_46.65%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup26}
              />
            </div>
            <div className="absolute inset-[39.84%_50.39%_59.57%_47.55%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup27}
              />
            </div>
            <div className="absolute inset-[40.61%_48.69%_58.34%_49.12%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup28}
              />
            </div>
            <div className="absolute inset-[40.73%_46.68%_58.19%_51.21%]">
              <img
                alt=""
                className="absolute block size-full max-w-none"
                src={imgGroup29}
              />
            </div>
          </div>
        </div>
      </div>

      {/* next page button */}
      <button
        type="button"
        className="absolute left-[558px] top-[3719px] h-[233px] w-[791px] border-0 bg-transparent p-0 cursor-pointer hover:scale-105 active:scale-100 transition-transform duration-100 z-30"
        onClick={handleTransitionClick}
        aria-label="Go to next page"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            alt="Multitasking Button"
            className="absolute -left-[71.55%] -top-[185.84%] h-[463.52%] w-[242.73%] max-w-none"
            src={imgMulti1}
          />
        </div>
      </button>

      {/* boss's notification */}
      <div
        ref={bossNotiRef}
        className="absolute inset-0 size-full pointer-events-none boss-noti-container"
      >
        <div className="absolute inset-[57.15%_12.91%_39.14%_58.96%]">
          <img
            alt=""
            className="absolute block size-full max-w-none"
            src={imgVector}
          />
        </div>
        <div className="absolute inset-[58.04%_26.84%_41.2%_66.12%]">
          <img
            alt=""
            className="absolute block size-full max-w-none"
            src={imgGroup30}
          />
        </div>
        <div className="absolute inset-[57.42%_34.35%_39.64%_59.81%] flex items-center justify-center">
          <div className="-scale-y-100 flex-none h-[126.99px] w-[112.05px] rotate-180">
            <div className="relative size-full">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <img
                  alt=""
                  className="absolute left-0 top-0 size-full max-w-none"
                  src={imgRectangle}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-[59.08%_16.83%_39.87%_66.16%]">
          <img
            alt=""
            className="absolute block size-full max-w-none"
            src={imgGroup31}
          />
        </div>
      </div>

      <div
        ref={pabDeawRef}
        className="absolute inset-0 size-full pointer-events-none pabdeaw-container"
      >
        <div className="absolute inset-[61.41%_6.86%_35.82%_71.41%]">
          <img
            alt=""
            className="absolute block size-full max-w-none"
            src={imgGroup32}
          />
        </div>
        <div className="absolute inset-[63.67%_2.46%_34%_87.71%]">
          <img
            alt=""
            className="absolute block size-full max-w-none"
            src={imgGroup33}
          />
        </div>
      </div>
    </div>
  );
}