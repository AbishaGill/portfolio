import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedWord from "./AnimatedWord";
import CurvedTransition from "./CurvedTransition";
import { usePreloader, usePrefersReducedMotion } from "./usePreloader";
import { DEFAULTS, DEFAULT_WORDS } from "./constants";

/**
 * Premium fullscreen typography preloader.
 * Cycles a word list with cinematic blur/scale/translate transitions, then
 * reveals the underlying app with an SVG "liquid sheet" curved mask.
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
 *   curveHeight     number    depth of the liquid-sheet curve in px
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
  curveHeight = DEFAULTS.curveHeight,
  onFinish,
}) => {
  const reduced = usePrefersReducedMotion();
  const { index, stage, finished, handleCurtainComplete } = usePreloader({
    words,
    duration,
    onFinish,
    reduced,
  });

  // Fully unmount after the reveal so nothing sits over the app / traps events.
  if (finished) return null;

  const showWords = stage === "words";
  const showCurtain = stage === "curtain";

  return (
    <div
      // fixed fullscreen overlay, very high z-index, clipped.
      // Opaque while words play (hides the app); TRANSPARENT during the curtain
      // so the sliding liquid-sheet reveals the landing page underneath instead
      // of the overlay's own background (which caused the blank white pause).
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 99999,
        overflow: "hidden",
        backgroundColor: showCurtain ? "transparent" : backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: showCurtain ? "none" : "auto",
      }}
      aria-hidden={finished}
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

      {showCurtain &&
        (reduced ? (
          <motion.div
            style={{ position: "absolute", inset: 0, backgroundColor }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onAnimationComplete={handleCurtainComplete}
          />
        ) : (
          <CurvedTransition
            backgroundColor={backgroundColor}
            curveHeight={curveHeight}
            onComplete={handleCurtainComplete}
          />
        ))}
    </div>
  );
};

export default Preloader;
