import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CURTAIN_FAILSAFE_MS, CURTAIN_MIN_MS, EASE_CURTAIN } from "./constants";

function measureViewport() {
  if (typeof window === "undefined") return { w: 390, h: 844 };
  const vv = window.visualViewport;
  const w = vv?.width || window.innerWidth || document.documentElement?.clientWidth || 390;
  const h = vv?.height || window.innerHeight || document.documentElement?.clientHeight || 844;
  return { w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) };
}

function useViewport() {
  const [size, setSize] = useState(measureViewport);
  useEffect(() => {
    const read = () => setSize(measureViewport());
    read();
    window.addEventListener("resize", read);
    window.visualViewport?.addEventListener("resize", read);
    return () => {
      window.removeEventListener("resize", read);
      window.visualViewport?.removeEventListener("resize", read);
    };
  }, []);
  return size;
}

const buildPath = (w, h, curve) =>
  `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h + curve} 0 ${h} Z`;

/**
 * Liquid-sheet exit. Always completes — onAnimationComplete plus a timeout —
 * so a missed Framer callback cannot pin the overlay.
 */
const CurvedTransition = ({ backgroundColor, curveHeight, onComplete }) => {
  const { w: width, h: height } = useViewport();
  const startedAt = useRef(
    typeof performance !== "undefined" ? performance.now() : Date.now(),
  );
  const settled = useRef(false);

  const settle = useCallback(() => {
    if (settled.current) return;
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    if (now - startedAt.current < CURTAIN_MIN_MS) return;
    settled.current = true;
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (settled.current) return;
      settled.current = true;
      onComplete?.();
    }, CURTAIN_FAILSAFE_MS);
    return () => window.clearTimeout(id);
  }, [onComplete]);

  const flat = buildPath(width, height, 0);
  const bulged = buildPath(width, height, curveHeight);
  const relaxed = buildPath(width, height, curveHeight * 0.35);

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        willChange: "transform",
      }}
      initial={{ y: 0 }}
      animate={{ y: -(height + curveHeight) }}
      transition={{ duration: 0.68, ease: EASE_CURTAIN, delay: 0.16 }}
      onAnimationComplete={settle}
    >
      <svg
        width={width}
        height={height + curveHeight}
        viewBox={`0 0 ${width} ${height + curveHeight}`}
        preserveAspectRatio="none"
        style={{ display: "block" }}
      >
        <motion.path
          fill={backgroundColor}
          initial={{ d: flat }}
          animate={{ d: [flat, bulged, relaxed] }}
          transition={{ duration: 0.94, ease: EASE_CURTAIN, times: [0, 0.28, 1] }}
        />
      </svg>
    </motion.div>
  );
};

export default CurvedTransition;
