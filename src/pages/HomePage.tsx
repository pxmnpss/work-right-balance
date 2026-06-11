import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ASSETS = {
  logo: "/figma-assets/home/logo.gif",
  ribbon: "/figma-assets/home/ribbon.png",
  pencil: "/figma-assets/home/pencil.png",
  paper: "/figma-assets/home/paper.png",
  postIt: "/figma-assets/home/post-it.png",
  spray: "/figma-assets/home/spray.png",
  bounceBg: "/figma-assets/home/bounce-bg.png",
  startBtn: "/figma-assets/home/start-btn.png",
} as const;

export function useProScale(baseWidth = 1920, baseHeight = 1080) {
  const [scale, setScale] = useState(1);

  const updateScale = useCallback(() => {
    const scaleX = window.innerWidth / baseWidth;
    const scaleY = window.innerHeight / baseHeight;
    setScale(Math.min(scaleX, scaleY));
  }, [baseWidth, baseHeight]);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  return scale;
}

export function StageWrapper({
  children,
  bgColor = "bg-[#00b3dc]",
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  bgColor?: string;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const scale = useProScale();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex min-h-screen w-screen items-center justify-center overflow-hidden border-0 p-0 text-inherit focus:outline-none ${bgColor} ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div
        className="relative shrink-0 overflow-hidden"
        style={{ width: 1920 * scale, height: 1080 * scale }}
      >
        <div
          className="absolute left-0 top-0 h-[1080px] w-[1920px] origin-top-left"
          style={{ transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </button>
  );
}

function CyanScreen() {
  return (
    <div className="relative h-[1080px] w-[1920px] overflow-hidden pointer-events-none">
      {/* Ribbon */}
      <div className="absolute z-[2] -left-[1.46%] top-[47.13%] right-[61.51%] bottom-[-16.34%] flex items-center justify-center">
        <div className="h-[502.626px] w-[584.029px] shrink-0 rotate-[35.23deg]">
          <div className="relative h-full w-full overflow-hidden">
            <img
              src={ASSETS.ribbon}
              alt=""
              className="absolute left-0 top-0 h-full w-full max-w-none object-fill"
            />
          </div>
        </div>
      </div>

      {/* Pencil */}
      <div className="absolute z-[2] left-[31px] top-[675px] h-[281px] w-[532px]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={ASSETS.pencil}
            alt=""
            className="absolute -left-[118.96%] -top-[133.11%] h-[364.86%] w-[343.47%] max-w-none"
          />
        </div>
      </div>

      {/* Paper */}
      <div className="absolute z-[2] -top-[102px] left-[114.82px] flex h-[497.595px] w-[640.372px] items-center justify-center">
        <div className="shrink-0 -rotate-[17.1deg]">
          <div className="relative h-[347.38px] w-[563.127px] overflow-hidden">
            <img
              src={ASSETS.paper}
              alt=""
              className="absolute inset-0 h-full w-full max-w-none object-cover"
            />
          </div>
        </div>
      </div>

      {/* Post-it */}
      <div className="absolute z-[2] left-[1225px] top-[27px] h-[774px] w-[936px]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={ASSETS.postIt}
            alt=""
            className="absolute -left-[38.67%] -top-[9.17%] h-[119.34%] w-[175.5%] max-w-none"
          />
        </div>
      </div>

      {/* Spray */}
      <div className="absolute z-[2] left-[1401px] top-[602px] flex h-[730.589px] w-[672.866px] items-center justify-center">
        <div className="shrink-0 rotate-[19.55deg]">
          <div className="relative h-[597px] w-[502px] overflow-hidden">
            <img
              src={ASSETS.spray}
              alt=""
              className="absolute -left-[141.83%] -top-[41.21%] h-[180.9%] w-[382.47%] max-w-none"
            />
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="absolute z-[5] left-1/2 top-1/2 h-[700px] w-[1500px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <img
          src={ASSETS.logo}
          alt="Logo"
          className="h-full w-full object-contain scale-[1.5]"
        />
      </div>

      {/* Bounce BG */}
      <img
        src={ASSETS.bounceBg}
        alt=""
        className="absolute inset-0 z-[3] h-full w-full object-cover"
      />

      {/* Start Button */}
      <div className="absolute z-[4] left-[57%] bottom-[4%] -translate-x-1/2 ml-16 w-[630px] h-[230px]">
        <img
          src={ASSETS.startBtn}
          alt="คลิกเพื่อเริ่มเกม"
          className="animate-custom-fade h-full w-full object-contain"
        />
      </div>
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();

  const handleStart = useCallback(() => {
    // @ts-ignore
    if (document.startViewTransition) {
      // @ts-ignore
      document.startViewTransition(() => {
        navigate("/intro");
      });
    } else {
      navigate("/intro");
    }
  }, [navigate]);

  return (
    <>
      <style>{`
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation-duration: 0.8s; 
          mix-blend-mode: normal;
        }

        @keyframes customFade { 
          0%, 100% { opacity: 1; } 
          50% { opacity: 0; } 
        }

        .animate-custom-fade {
          animation: customFade 2.5s infinite ease-in-out;
        }
      `}</style>

      <StageWrapper
        bgColor="bg-[#00b3dc]"
        onClick={handleStart}
        ariaLabel="กดที่ใดก็ได้บนหน้าจอเพื่อเริ่มเกม"
      >
        <CyanScreen />
      </StageWrapper>
    </>
  );
}