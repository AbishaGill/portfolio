// Self-contained config + motion variants for the typography preloader.
// Plain JS to match the project's JSX/JS conventions (no TypeScript in repo).

// Multilingual lowercase greetings (configurable via the `words` prop).
export const DEFAULT_WORDS = [
  "hello",
  "سلام",
  "bonjour",
  "नमस्ते",
  "hola",
];

// Custom cubic-beziers (never the library default easing).
export const EASE_OUT = [0.16, 1, 0.3, 1]; // expo-ish out — cinematic settle
export const EASE_IN = [0.7, 0, 0.84, 0]; // quint-ish in — quick lift on exit
export const EASE_CURTAIN = [0.76, 0, 0.24, 1]; // inOut-quint — liquid sheet

// Hold for the FINAL word before the curtain starts. Kept short so the reveal
// flows in quickly (unlike the 3s word-to-word gap): ~550ms enter + ~150ms beat.
export const FINAL_HOLD = 900;

export const DEFAULTS = {
  duration: 900, // per-word on-screen hold (ms) 
  backgroundColor: "#ffffff",
  textColor: "#333333", // dark charcoal, per reference
  // Poppins Bold = rounded geometric sans (loaded via index.css @import).
  // Falls back to system sans-serif if the webfont fails to load.
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 500,
  // Responsive via clamp: ~36px mobile floor → scales with viewport → 72px cap
  // on tablet/desktop/ultrawide. Never overflows narrow screens.
  fontSize: "clamp(2.25rem, 8vw, 4.5rem)",
  curveHeight: 220,
};

// Full cinematic per-word lifecycle.
export const wordVariants = {
  initial: { opacity: 0, scale: 0.94, y: 30, filter: "blur(10px)" },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -30,
    filter: "blur(6px)",
    transition: { duration: 0.45, ease: EASE_IN },
  },
};

// prefers-reduced-motion: fast, simple fade — no blur/scale/translate.
export const wordVariantsReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Subtle "hold" breathing applied to the inner glyph while a word is centered.
export const breathing = {
  scale: [1, 1.015, 1],
  opacity: [1, 0.92, 1],
};
export const breathingTransition = {
  duration: 1.2,
  ease: "easeInOut",
  repeat: Infinity,
  repeatType: "loop",
};
