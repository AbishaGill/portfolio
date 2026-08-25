import React from "react";
import { motion } from "framer-motion";
import {
  COMPLEX_SCRIPT,
  slotVariants,
  wordVariants,
  wordVariantsReduced,
} from "./constants";

const riseOnly = ({ y }) => `translate3d(0px, ${y ?? 0}, 0px)`;

/**
 * Pinned fullscreen slot (absolute + inset 0) so words crossfade in place.
 * The inner cluster rises as one unit (Y only) — no per-letter stagger that
 * can read as a slide in from the right.
 */
const AnimatedWord = ({ word, textColor, fontFamily, fontWeight, fontSize, reduced }) => {
  const complex = COMPLEX_SCRIPT.test(word);
  const glyphs = complex ? [word] : Array.from(word);

  const textStyle = {
    color: textColor,
    fontFamily,
    fontWeight,
    fontSize,
    lineHeight: 1,
    letterSpacing: complex ? "0" : "-0.02em",
    textTransform: "lowercase",
    whiteSpace: "nowrap",
    display: "inline-block",
  };

  return (
    <motion.div
      variants={reduced ? wordVariantsReduced : slotVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        overflow: "hidden",
        willChange: "opacity",
      }}
    >
      <motion.div
        variants={reduced ? wordVariantsReduced : wordVariants}
        transformTemplate={reduced ? undefined : riseOnly}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          willChange: "transform, opacity, filter",
        }}
      >
        {glyphs.map((glyph, i) => (
          <span key={`${word}-${i}`} style={textStyle}>
            {glyph === " " ? "\u00A0" : glyph}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedWord;
