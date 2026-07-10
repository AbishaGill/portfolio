import { useCallback, useEffect, useRef, useState } from "react";
import { FINAL_HOLD } from "./constants";

/**
 * Detects prefers-reduced-motion and keeps it live across changes.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Owns the whole preloader lifecycle:
 *  - loading state + current word index (cycles the word array)
 *  - transition stage: "words" → "curtain" → "done"
 *  - finished flag + onFinish callback
 *  - all timers, cleaned up on unmount (no leaks)
 *
 * @param {object} opts
 * @param {string[]} opts.words
 * @param {number} opts.duration    per-word on-screen time (ms)
 * @param {() => void} [opts.onFinish]
 * @param {boolean} [opts.reduced]  prefers-reduced-motion active
 */
export function usePreloader({ words, duration, onFinish, reduced = false }) {
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState("words"); // "words" | "curtain" | "done"
  const [finished, setFinished] = useState(false);

  // Keep the collection of pending timeouts so we can clear every one on unmount.
  const timers = useRef([]);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const schedule = useCallback((fn, ms) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  // Advance through the word list, then hand off to the curtain transition.
  useEffect(() => {
    if (stage !== "words") return undefined;
    if (index >= words.length - 1) {
      // Last word shown — brief hold (FINAL_HOLD), then start the liquid-sheet
      // curtain. Uses a short buffer, NOT the 3s word-to-word `duration`, so the
      // reveal flows in almost immediately with no idle stall.
      schedule(() => setStage("curtain"), FINAL_HOLD);
      return undefined;
    }
    schedule(() => setIndex((i) => i + 1), duration);
    return undefined;
  }, [index, stage, words.length, duration, schedule]);

  // Curtain choreography total ~1.5s (skipped for reduced motion → fast fade).
  const handleCurtainComplete = useCallback(() => {
    setStage("done");
    setFinished(true);
    onFinishRef.current?.();
  }, []);

  // Body scroll lock while the overlay is active; always restored on unmount.
  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Clear every outstanding timer when the hook unmounts.
  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, []);

  return { index, stage, finished, handleCurtainComplete, reduced };
}
