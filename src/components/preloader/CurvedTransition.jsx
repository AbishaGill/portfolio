import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE_CURTAIN } from "./constants";

/**
 * Reads live viewport size so the SVG path scales to any screen
 * (mobile / tablet / desktop / ultrawide).
 */
function useViewport() {
  // Measure synchronously on first render so the sheet paints fully covering the
  // screen immediately — a useEffect-only measure would leave a blank first frame.
  const [size, setSize] = useState(() =>
    typeof window === "undefined"
      ? { w: 0, h: 0 }
      : { w: window.innerWidth, h: window.innerHeight }
  );
  useEffect(() => {
    const read = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  return size;
}

// Build an SVG path for the sheet: a full-height rect whose BOTTOM edge is a
// quadratic curve bulging `curve` px below the flat baseline at height `h`.
const buildPath = (w, h, curve) =>
  `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h + curve} 0 ${h} Z`;

/**
 * "Liquid sheet" final exit — an SVG curved mask, not a fade.
 *  Phase 1 (0.4s): curve expands (flat bottom → deep bulge).
 *  Phase 2 (1.1s): the whole sheet slides up off-screen.
 *  Phase 3: curve relaxes flat as it clears the top (~1.5s total).
 *
 * Reduced motion: parent renders a plain fade instead of this component.
 */
const CurvedTransition = ({ backgroundColor, curveHeight, onComplete }) => {
  const { w, h } = useViewport();
  if (!w || !h) return null;

  const flat = buildPath(w, h, 0);
  const bulged = buildPath(w, h, curveHeight);
  // Relaxed shape used while sliding away — slight residual curve reads as liquid.
  const relaxed = buildPath(w, h, curveHeight * 0.35);

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        willChange: "transform",
      }}
      // Phase 2 + 3: slide the sheet up past its own curved bottom.
      initial={{ y: 0 }}
      animate={{ y: -(h + curveHeight) }}
      transition={{ duration: 1.1, ease: EASE_CURTAIN, delay: 0.4 }}
      onAnimationComplete={onComplete}
    >
      <svg
        width={w}
        height={h + curveHeight}
        viewBox={`0 0 ${w} ${h + curveHeight}`}
        preserveAspectRatio="none"
        style={{ display: "block" }}
      >
        <motion.path
          fill={backgroundColor}
          initial={{ d: flat }}
          // Phase 1: expand curve, then Phase 3: relax it as it exits.
          animate={{ d: [flat, bulged, relaxed] }}
          transition={{ duration: 1.5, ease: EASE_CURTAIN, times: [0, 0.27, 1] }}
        />
      </svg>
    </motion.div>
  );
};

export default CurvedTransition;
