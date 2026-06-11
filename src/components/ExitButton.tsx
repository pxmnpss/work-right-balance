import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

const BASE_WIDTH = 1920;

function useExitScale() {
  const [scale, setScale] = useState(1);

  const onResize = useCallback(() => {
    setScale(Math.min(1, window.innerWidth / BASE_WIDTH));
  }, []);

  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onResize]);

  return scale;
}

export default function ExitButton({ mode = "fixed" }: { mode?: "fixed" | "absolute" }) {
  const scale = useExitScale();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const isFixed = mode === "fixed";
  const buttonScale = isFixed ? scale : 1; 

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowModal((prev) => !prev);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleGoHome = useCallback(() => {
    // @ts-ignore
    if (document.startViewTransition) {
      // @ts-ignore
      document.startViewTransition(() => navigate("/"));
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div
        className={`${isFixed ? "fixed" : "absolute"} z-[999] origin-top-right`}
        style={{
          top: 45 * buttonScale,
          right: 48 * buttonScale,
          width: "90px",
          height: "92px",
          transform: `scale(${buttonScale})`,
        }}
      >
        <button
          onClick={() => setShowModal(true)}
          className="peer relative z-10 w-full h-full cursor-pointer border-none bg-transparent p-0 outline-none transition-transform duration-150 hover:scale-105 active:scale-100 block"
        >
          <img
            src="/figma-assets/exit/esc.png"
            alt="ESC"
            className="w-full h-full object-contain"
          />
        </button>

        <div
          className="absolute top-1/2 -translate-y-1/2 right-[80px] z-20 opacity-0 translate-x-4 pointer-events-none transition-all duration-200 ease-out peer-hover:opacity-100 peer-hover:translate-x-0"
          style={{ width: "242px", height: "70px" }}
        >
          <img
            src="/figma-assets/exit/esc-text.png"
            alt="พับจอ พอแล้วจั๊ฟ"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {showModal && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center"
          style={{ animation: "fadeIn 0.2s ease-out forwards" }}
        >
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setShowModal(false)}
          />

          <div
            className="relative z-10 flex flex-col items-center origin-center"
            style={{ transform: `scale(${scale})` }}
          >
            <img
              src="/figma-assets/exit/exit-question.png"
              alt="ต้องการออกไปหน้าแรกหรือไม่"
              className="mb-[117px] object-contain"
              style={{ width: "1215px", height: "auto" }}
            />

            <div className="flex items-center gap-[113px]">
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer border-none bg-transparent p-0 outline-none transition-transform duration-150 hover:scale-95"
                style={{ width: "301px", height: "auto" }}
              >
                <img
                  src="/figma-assets/exit/no-exit.png"
                  alt="ไม่ก็ได้"
                  className="w-full h-auto object-contain"
                />
              </button>

              <button
                onClick={handleGoHome}
                className="cursor-pointer border-none bg-transparent p-0 outline-none transition-transform duration-150 hover:scale-95"
                style={{ width: "301px", height: "auto" }}
              >
                <img
                  src="/figma-assets/exit/exit.png"
                  alt="ออกจ้ะ"
                  className="w-full h-auto object-contain"
                />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}