import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { IntroLayout } from "./pages/IntroLayout";
import { MultitaskingPage } from "./pages/MultitaskingPage";
import { Game1Page } from "./pages/Game1Page";
import { Game2Page } from "./pages/Game2Page";
import { Game3Page } from "./pages/Game3Page";
import Game4Page from "./pages/Game4Page";
import Game5Page from "./pages/Game5Page";
import EndPage from "./pages/EndPage";

export default function App() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/intro" element={<IntroLayout />} />
        <Route path="/multitasking" element={<MultitaskingPage />} />
        <Route path="/game1" element={<Game1Page />} />
        <Route path="/game2" element={<Game2Page />} />
        <Route path="/game3" element={<Game3Page />} />
        <Route path="/game4" element={<Game4Page />} />
        <Route path="/game5" element={<Game5Page />} />
        <Route path="/end" element={<EndPage />} />
      </Routes>
    </div>
  );
}
