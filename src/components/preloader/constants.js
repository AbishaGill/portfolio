// Self-contained config + motion variants for the typography preloader.
// Plain JS to match the project's JSX/JS conventions (no TypeScript in repo).

// Multilingual lowercase greetings (configurable via the `words` prop).
export const DEFAULT_WORDS = [
  "hello",
  "سلام",
  "bonjour",
  "hola",
];

// Custom cubic-beziers (never the library default easing).
export const EASE_OUT = [0.22, 1, 0.36, 1]; // expo-ish out — cinematic settle
export const EASE_IN = [0.55, 0, 1, 0.35]; // quick, confident lift on exit
export const EASE_CURTAIN = [0.77, 0, 0.18, 1]; // inOut-quint — liquid sheet

// Last-word beat before the overlay exit. Short so the reveal does not idle.
export const FINAL_HOLD = 900;

// Overlay slide-up + site fade. Timer-driven — never waits on animationcomplete.
export const EXIT_MS = 720;
export const EXIT_MS_REDUCED = 200;

// Hard cap for the entire overlay (words + exit). Always dismiss by this
// time even if an animation callback never fires.
// Words: 3×900 + 900 hold = 3600, then EXIT_MS. Slack so the cap cannot
// cut the slide-up (the old 3500 cap fired before the reveal started).
export const MAX_PRELOADER_MS = 3600 + EXIT_MS + 200;

// If the exit stage itself stalls, force-finish (mirrors EXIT_MS).
export const CURTAIN_FAILSAFE_MS = EXIT_MS;
export const CURTAIN_MIN_MS = 780;

export const DEFAULTS = {
  duration: 900, // per-word on-screen hold (ms)
  backgroundColor: "#ffffff",
  textColor: "#333333",
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 500,
  fontSize: "clamp(2.25rem, 8vw, 4.5rem)",
  curveHeight: 180,
};

// Slot fades only (pinned overlay, no slide). Inner cluster rises on Y.
export const slotVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.16, ease: EASE_OUT, delay: 0.05 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.12, ease: EASE_IN },
  },
};

export const wordVariants = {
  initial: { y: 48, opacity: 0, filter: "blur(6px)" },
  animate: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.36,
      ease: EASE_OUT,
    },
  },
  exit: {
    y: -32,
    opacity: 0,
    filter: "blur(5px)",
    transition: {
      duration: 0.14,
      ease: EASE_IN,
    },
  },
};

// Arabic / Devanagari join incorrectly if split into code points — treat as one.
export const COMPLEX_SCRIPT = /[\u0600-\u06FF\u0900-\u097F]/;

export const wordVariantsReduced = {
  initial: { opacity: 0, x: 0, y: 0 },
  animate: { opacity: 1, x: 0, y: 0, transition: { duration: 0.18 } },
  exit: { opacity: 0, x: 0, y: 0, transition: { duration: 0.16 } },
};
