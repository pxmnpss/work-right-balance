import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IntroPage } from "./IntroPage";

const INTRO_W = 1920;
const INTRO_H = 4320;

function useIntroScale() {
  const [scale, setScale] = useState(1);
  const update = useCallback(() => {
    setScale(Math.min(1, window.innerWidth / INTRO_W));
  }, []);
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);
  return scale;
}

/** Scales the 1920×4320 Figma frame to fit the viewport width (no horizontal overflow). */
export function IntroLayout() {
  const scale = useIntroScale();
  const navigate = useNavigate();

  const handleMultiClick = useCallback(() => {
    navigate("/multitasking");
  }, [navigate]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[#0d0d0d]">
      <div
        className="relative mx-auto shrink-0"
        style={{
          width: INTRO_W * scale,
          height: INTRO_H * scale,
        }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left will-change-transform"
          style={{
            width: INTRO_W,
            height: INTRO_H,
            transform: `scale(${scale})`,
          }}
        >
          <IntroPage onMultiClick={handleMultiClick} />
        </div>
      </div>
    </div>
  );
}