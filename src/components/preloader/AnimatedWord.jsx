import React from "react";
import { motion } from "framer-motion";
import {
  wordVariants,
  wordVariantsReduced,
  breathing,
  breathingTransition,
} from "./constants";

/**
 * A single centered word with the full enter → hold(breathing) → exit lifecycle.
 * Animates only transform / opacity / filter (GPU-accelerated, no reflow).
 */
const AnimatedWord = ({ word, textColor, fontFamily, fontWeight, fontSize, reduced }) => {
  const variants = reduced ? wordVariantsReduced : wordVariants;

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        willChange: "transform, opacity, filter",
      }}
    >
      {/* Inner span carries the subtle "hold" breathing so it composes with the
          outer enter/exit transform without fighting it. Disabled for reduced. */}
      <motion.span
        animate={reduced ? undefined : breathing}
        transition={reduced ? undefined : breathingTransition}
        style={{
          color: textColor,
          fontFamily,
          fontWeight,
          fontSize,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          textTransform: "lowercase",
          whiteSpace: "nowrap",
          willChange: "transform, opacity",
        }}
      >
        {word}
      </motion.span>
    </motion.div>
  );
};

export default AnimatedWord;
