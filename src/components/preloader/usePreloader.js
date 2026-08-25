import { useCallback, useEffect, useRef, useState } from "react";
import { CURTAIN_FAILSAFE_MS, FINAL_HOLD, MAX_PRELOADER_MS } from "./constants";

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
 * Owns the preloader lifecycle. Word advance is timer-driven (never waits on
 * asset load or animation-complete). A hard max timeout always dismisses.
 */
export function usePreloader({ words, duration, onFinish, reduced = false }) {
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState("words");
  const [finished, setFinished] = useState(false);

  const timers = useRef([]);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;
  const finishedRef = useRef(false);

  const schedule = useCallback((fn, ms) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearTimers();
    setStage("done");
    setFinished(true);
    onFinishRef.current?.();
  }, [clearTimers]);

  const handleCurtainComplete = finish;

  // Single timeline for the word list — one timeout chain, cleaned on unmount
  // or when we leave the words stage. Reduced motion: one short beat, then out.
  useEffect(() => {
    if (stage !== "words") return undefined;

    if (reduced) {
      const id = schedule(() => setStage("curtain"), 400);
      return () => window.clearTimeout(id);
    }

    const ids = [];
    let acc = 0;
    for (let i = 0; i < words.length - 1; i += 1) {
      acc += duration;
      ids.push(schedule(() => setIndex(i + 1), acc));
    }
    ids.push(schedule(() => setStage("curtain"), acc + FINAL_HOLD));

    return () => {
      ids.forEach((id) => window.clearTimeout(id));
    };
  }, [stage, words, duration, reduced, schedule]);

  // Curtain must not wait forever on onAnimationComplete (often missed if the
  // SVG path animation is interrupted or the viewport reports 0×0).
  useEffect(() => {
    if (stage !== "curtain") return undefined;
    const id = schedule(finish, CURTAIN_FAILSAFE_MS);
    return () => window.clearTimeout(id);
  }, [stage, schedule, finish]);

  // Absolute cap — never block the site past MAX_PRELOADER_MS.
  useEffect(() => {
    const id = schedule(finish, MAX_PRELOADER_MS);
    return () => window.clearTimeout(id);
  }, [schedule, finish]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    document.documentElement.classList.add("preloader-active");
    return () => {
      document.documentElement.classList.remove("preloader-active");
    };
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return { index, stage, finished, handleCurtainComplete, reduced };
}
