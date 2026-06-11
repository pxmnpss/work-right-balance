import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExitButton from "../components/ExitButton";

const W = 1950;
const H = 2194;

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

export default function EndPage() {
  const scale = useScale();
  const navigate = useNavigate();
  const [showWindow, setShowWindow] = useState(false);

  const handleGoHome = useCallback(() => {
    // @ts-ignore
    if (document.startViewTransition) {
      // @ts-ignore
      document.startViewTransition(() => navigate("/"));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const btnClass =
    "absolute z-10 cursor-pointer border-none bg-transparent p-0 outline-none transition-transform duration-150 hover:scale-105 active:scale-100";

  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-slate-100 smooth-scroll">
      <style>{`
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation-duration: 0.5s;
          mix-blend-mode: normal;
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <ExitButton />

      <div
        className="relative mx-auto"
        style={{ width: W * scale, height: H * scale }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: W, height: H, transform: `scale(${scale})` }}
        >
          <section className="relative h-full w-full overflow-hidden bg-white">
            <img
              src="/figma-assets/end/bg.png"
              alt="background"
              className="absolute bottom-0 left-0 z-0 h-full w-full object-cover object-bottom pointer-events-none"
            />

            <div className="absolute left-0 top-0 z-10 h-full w-full bg-transparent">
              <img
                src="/figma-assets/end/work.gif"
                alt="Work Animation"
                className="absolute z-10 object-contain pointer-events-none"
                style={{ left: 567, bottom: 37.63, width: 816, height: 459 }}
              />

              <button
                onClick={() => setShowWindow(true)}
                className={btnClass}
                style={{ left: 685, top: 692, width: 580.26, height: 438.96 }}
              >
                <img
                  src="/figma-assets/end/file.png"
                  alt="File"
                  className="h-full w-full object-contain"
                />
              </button>

              <button
                onClick={handleGoHome}
                className={btnClass}
                style={{
                  left: 742,
                  bottom: 68.56,
                  width: 465.26,
                  height: 48.44,
                }}
              >
                <img
                  src="/figma-assets/end/click.png"
                  alt="Click"
                  className="h-full w-full object-contain"
                />
              </button>
            </div>
          </section>
        </div>
      </div>

      {showWindow && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ animation: "fadeInScale 0.25s ease-out forwards" }}
        >
          <div
            className="absolute inset-0"
            onClick={() => setShowWindow(false)}
          />

          <div className="relative z-10 w-[90%] max-w-[600px]">
            <img
              src="/figma-assets/end/window.png"
              alt="Window"
              className="block h-auto w-full object-contain"
            />

            <button
              onClick={() => setShowWindow(false)}
              aria-label="Close"
              className="absolute right-[4%] top-[4%] aspect-square w-[6%] cursor-pointer rounded border-none bg-transparent outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}