import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

// MagicUI SmoothCursor, ported to this project's stack (Vite + JSX +
// framer-motion — no shadcn/TS/@-alias here). Spring-follows the mouse and
// rotates toward the movement direction.

// Default cursor arrow, themed with the site's CSS variables (not hardcoded
// hex) so it tracks the theme: --text-primary fill, --accent tip.
function DefaultCursorSVG() {
  return (
    <svg
      width="25"
      height="27"
      viewBox="0 0 50 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0px 1px 3px rgba(0,0,0,0.35))" }}
    >
      <path
        d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
        fill="var(--text-primary, #ffffff)"
      />
      <path
        d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.65427 22.3668 6.34306L6.57226 40.6933C5.3223 43.4111 8.00426 46.3382 10.9184 45.2427L24.8815 40.0969C25.0281 40.0424 25.1918 40.0424 25.3453 40.0969L39.2152 45.2427C42.1279 46.3382 44.9345 43.4111 43.7146 40.6933Z"
        fill="var(--accent, #bef264)"
      />
    </svg>
  );
}

const DEFAULT_SPRING = {
  damping: 45,
  stiffness: 400,
  mass: 1,
  restDelta: 0.001,
};

export function SmoothCursor({
  cursor = <DefaultCursorSVG />,
  springConfig = DEFAULT_SPRING,
}) {
  const [enabled, setEnabled] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastUpdateTime = useRef(0);
  const previousAngle = useRef(0);
  const accumulatedRotation = useRef(0);

  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const rotation = useSpring(0, { ...springConfig, damping: 60, stiffness: 300 });
  const scale = useSpring(1, { ...springConfig, stiffness: 500, damping: 35 });

  // Only run on fine-pointer (non-touch) devices.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const updateVelocity = (currentPos) => {
      const now = performance.now();
      const dt = now - lastUpdateTime.current;
      if (dt > 0) {
        velocity.current = {
          x: (currentPos.x - lastMousePos.current.x) / dt,
          y: (currentPos.y - lastMousePos.current.y) / dt,
        };
      }
      lastUpdateTime.current = now;
      lastMousePos.current = currentPos;
    };

    let resetTimeout;
    const onMove = (e) => {
      const currentPos = { x: e.clientX, y: e.clientY };
      updateVelocity(currentPos);

      const speed = Math.sqrt(
        velocity.current.x ** 2 + velocity.current.y ** 2
      );

      cursorX.set(currentPos.x);
      cursorY.set(currentPos.y);

      if (speed > 0.1) {
        const currentAngle =
          (Math.atan2(velocity.current.y, velocity.current.x) * 180) / Math.PI +
          90;

        let angleDiff = currentAngle - previousAngle.current;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;
        accumulatedRotation.current += angleDiff;
        rotation.set(accumulatedRotation.current);
        previousAngle.current = currentAngle;

        scale.set(0.95);
        clearTimeout(resetTimeout);
        resetTimeout = setTimeout(() => scale.set(1), 150);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      clearTimeout(resetTimeout);
    };
  }, [enabled, cursorX, cursorY, rotation, scale]);

  if (!enabled) return null;

  return (
    <motion.div
      // hidden md:block: extra touch/small-screen guard from the MagicUI demo.
      // smooth-cursor: lets index.css hide it while the preloader is active.
      className="smooth-cursor hidden md:block"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        translateX: cursorX,
        translateY: cursorY,
        rotate: rotation,
        scale,
        zIndex: 2147483000, // above everything, incl. the preloader overlay
        pointerEvents: "none", // never blocks clicks/hover
        willChange: "transform",
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {cursor}
    </motion.div>
  );
}

export default SmoothCursor;
