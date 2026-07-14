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

  // Single guarded finish path — used by both the normal curtain completion
  // and the fail-safe below, so onFinish can never fire twice.
  const finishedRef = useRef(false);
  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setStage("done");
    setFinished(true);
    onFinishRef.current?.();
  }, []);

  // Curtain choreography total ~1.5s (skipped for reduced motion → fast fade).
  const handleCurtainComplete = finish;

  // FAIL-SAFE: the preloader must never hide the site indefinitely. Its word
  // advance depends on animation-completion callbacks (AnimatePresence
  // mode="wait" waits for each exit to finish); if a low-end device stalls that
  // chain (main-thread contention, throttled rAF, etc.), the overlay would sit
  // on the first word forever. Force-finish after the worst-case expected run
  // time plus a generous margin — a no-op whenever the normal flow completes.
  useEffect(() => {
    const perWord = duration + 1200; // hold + enter ~550 + exit ~450 + overhead
    const curtain = 1500;
    const margin = 5000;
    const total = words.length * perWord + FINAL_HOLD + curtain + margin;
    schedule(finish, total);
  }, [words.length, duration, schedule, finish]);

  // Lock scroll AND hide the scrollbar track while the overlay is active.
  // Uses a class (styles in index.css) so we can suppress the webkit + Firefox
  // scrollbar, not just the scroll position. Always removed on unmount so the
  // landing page's scrollbar and scrolling are fully restored.
  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    document.documentElement.classList.add("preloader-active");
    return () => {
      document.documentElement.classList.remove("preloader-active");
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
