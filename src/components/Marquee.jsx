import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Marquee = () => {
  const textRef = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // ease:"none" keeps a constant scroll speed. Loop duration tuned to 29s
    // for a livelier pace.
    tweenRef.current = gsap.fromTo(
      el,
      { xPercent: -100 },
      {
        xPercent: 0,
        duration: 20,
        ease: "none",
        repeat: -1,
      }
    );

    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  // Ease the loop's velocity down to a full stop on hover (timeScale 1 → 0),
  // and back up on leave. Because we only scale time, the marquee resumes from
  // exactly where it paused instead of restarting.
  const handleEnter = () => {
    if (!tweenRef.current) return;
    gsap.to(tweenRef.current, {
      timeScale: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleLeave = () => {
    if (!tweenRef.current) return;
    gsap.to(tweenRef.current, {
      timeScale: 1,
      duration: 0.4,
      ease: "power2.in",
    });
  };

  return (
    <div className="mt-4 w-full bg-lime-300 text-black lg:py-6 ">
      <div
        className="flex overflow-hidden whitespace-nowrap"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <h1
          ref={textRef}
          className="py-2 text-3xl font-bold leading-none tracking-tigher lg:text-7xl"
        >
          REACT JS · NEXT JS · REACT NATIVE · TYPESCRIPT · TAILWIND · JAVASCRIPT · GIT · GITHUB · WORDPRESS · GHL
        </h1>
      </div>
    </div>
  );
};

export default Marquee;
