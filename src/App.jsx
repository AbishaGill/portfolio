import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Work from "./components/Work";
import Contact from "./components/Contact";
import Projects from "./components/Projects";

function App() {
  return (
    <>
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
