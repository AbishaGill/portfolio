import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedWord from "./AnimatedWord";
import { usePreloader, usePrefersReducedMotion } from "./usePreloader";
import { DEFAULTS, DEFAULT_WORDS, EASE_OUT, EXIT_MS, EXIT_MS_REDUCED } from "./constants";

/**
 * Premium fullscreen typography preloader.
 * Cycles a word list with cinematic blur/scale/translate transitions, then
 * slides the whole overlay upward while the site fades in underneath.
 *
 * Additive & self-contained — mount once at app root (see App.jsx wiring).
 *
 * Props:
 *   words           string[]  words to cycle (default: Design…Experience)
 *   duration        number    per-word on-screen time in ms
 *   backgroundColor string
 *   textColor       string
 *   fontFamily      string
 *   fontWeight      number|string
 *   fontSize        string    CSS size (responsive clamp by default)
 *   onReveal        () => void called when the exit slide starts (site fade)
 *   onFinish        () => void called once the reveal completes
 */
const Preloader = ({
  words = DEFAULT_WORDS,
  duration = DEFAULTS.duration,
  backgroundColor = DEFAULTS.backgroundColor,
  textColor = DEFAULTS.textColor,
  fontFamily = DEFAULTS.fontFamily,
  fontWeight = DEFAULTS.fontWeight,
  fontSize = DEFAULTS.fontSize,
  onReveal,
  onFinish,
}) => {
  const reduced = usePrefersReducedMotion();
  const { index, stage, finished } = usePreloader({
    words,
    duration,
    onReveal,
    onFinish,
    reduced,
  });

  // Fully unmount after the reveal so nothing sits over the app / traps events.
  if (finished) return null;

  const showWords = stage === "words";
  const exiting = stage === "exit";
  const exitSec = (reduced ? EXIT_MS_REDUCED : EXIT_MS) / 1000;

  return (
    <motion.div
      // fixed fullscreen overlay, very high z-index, clipped.
      // Stays opaque so the site is revealed by the slide, not a hard swap.
      initial={false}
      animate={
        exiting
          ? reduced
            ? { y: 0, opacity: 0 }
            : { y: "-100%", opacity: 1 }
          : { y: 0, opacity: 1 }
      }
      transition={{ duration: exitSec, ease: EASE_OUT }}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 99999,
        overflow: "hidden",
        backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: exiting ? "none" : "auto",
        willChange: "transform, opacity",
      }}
      aria-hidden={finished || exiting}
      role="presentation"
    >
      {/* Overlapping enter/exit (not mode="wait") so letter stagger can finish
          without blocking the next greeting — wait-mode was a freeze source. */}
      <AnimatePresence>
        {showWords && (
          <motion.div
            key="words"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.55, 0, 1, 0.35] }}
            style={{
              position: "absolute",
              inset: 0,
            }}
          >
            <AnimatePresence>
              <AnimatedWord
                key={words[index]}
                word={words[index]}
                textColor={textColor}
                fontFamily={fontFamily}
                fontWeight={fontWeight}
                fontSize={fontSize}
                reduced={reduced}
              />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Preloader;
