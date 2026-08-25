import { useState } from "react";
import { motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Work from "./components/Work";
import Contact from "./components/Contact";
import Projects from "./components/Projects";
import Preloader from "./components/preloader/Preloader";
import SmoothCursor from "./components/ui/SmoothCursor";
import { EASE_OUT, EXIT_MS } from "./components/preloader/constants";

function App() {
  // loading → revealing (overlay slides, site fades) → done (overlay gone).
  const [intro, setIntro] = useState("loading");
  const loading = intro !== "done";

  return (
    <>
      {/* Site-wide spring-follow cursor (MagicUI SmoothCursor, ported to JSX).
          Self-disables on touch devices; native cursor is hidden via index.css. */}
      <SmoothCursor />
      {/* Fullscreen intro overlay. Renders above the app on first load and
          fully unmounts after its slide-up reveal (onFinish). The app below
          stays mounted the whole time → zero white flash / zero layout shift. */}
      {loading && (
        <Preloader
          onReveal={() => setIntro((phase) => (phase === "done" ? phase : "revealing"))}
          onFinish={() => setIntro("done")}
        />
      )}
      <motion.div
        className="font-light text-white antialiased selection:bg-lime-300 selection:text-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: intro === "loading" ? 0 : 1 }}
        transition={{ duration: EXIT_MS / 1000, ease: EASE_OUT }}
      >
        <Navbar />
        {/* Hold the Lanyard's physics drop-in until the preloader finishes, so
            its top-to-bottom entrance actually plays on reveal instead of
            settling silently behind the overlay. */}
        <Hero lanyardPaused={loading} />
        <Marquee />
        <Projects />
        <About />
        <Work />
        <Contact />
      </motion.div>
    </>
  );
}

export default App;
