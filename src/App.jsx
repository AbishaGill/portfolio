import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Work from "./components/Work";
import Contact from "./components/Contact";
import Projects from "./components/Projects";
import Preloader from "./components/preloader/Preloader";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* Fullscreen intro overlay. Renders above the app on first load and
          fully unmounts after its liquid-sheet reveal (onFinish). The app below
          stays mounted the whole time → zero white flash / zero layout shift. */}
      {loading && <Preloader onFinish={() => setLoading(false)} />}
      <div className="font-light text-white antialiased selection:bg-lime-300 selection:text-black">
        <Navbar />
        <Hero />
        <Marquee />
        <Projects />
        <About />
        <Work />
        <Contact />
      </div>
    </>
  );
}

export default App;
