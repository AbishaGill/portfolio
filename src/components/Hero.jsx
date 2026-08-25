import React from "react";
import { motion } from "framer-motion";
import Lanyard from "./Lanyard";
import ScrollReveal from "./ScrollReveal";

const Hero = ({ lanyardPaused = false }) => {
  // Animation Variants
  const headingVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center">
        {/* relative z-10: keep the heading above the Lanyard column, whose
            opaque black bg (white-flash fix) and md:-mt-32 offset otherwise
            paint over this text since the Lanyard row comes later in the DOM. */}
        <motion.h1
          className="relative z-10 mt-16 overflow-hidden text-[12vw] font-semibold uppercase leading-none"
          initial="hidden"
          animate="visible"
          variants={headingVariants}
        >
          Abisha Iqbal <br />
          <span className="block text-center">Gill</span>
        </motion.h1>
        {/* relative z-10: keep the Resume button above the Lanyard bg so it stays
            fully visible and clickable. */}
        <motion.div
          className="relative z-10 mt-8"
          initial="hidden"
          animate="visible"
          variants={buttonVariants}
        >
          <motion.a
            href="/Abisha_Iqbal_Gill_Resume.docx"
            rel="noopener noreferrer"
            target="_blank"
            download
            className="flex items-center rounded-xl bg-lime-300 p-2 px-9 font-sansfont-medium text-black hover:bg-lime-400"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            data-cursor-label="Open"
          >
            <span>Resume</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
              />
            </svg>
          </motion.a>
        </motion.div>

        {/* Two-column row: ScrollReveal on the left, Lanyard on the right.
            DOM order keeps mobile stacking as Lanyard → text; md:order swaps
            them side-by-side on desktop (text left, card right). */}
        <div className="mt-8 flex w-full flex-col items-center gap-8 md:flex-row md:items-stretch">
          {/* Right (desktop): interactive Lanyard card.
              Negative top margin pulls only this column upward so the card sits
              higher in the viewport — ScrollReveal (separate column) is untouched. */}
          {/* mobile: no negative top margin (was -mt-16, which pulled the card
              up into the Resume button). md:-mt-32 keeps the desktop/tablet
              upward offset unchanged. */}
          <motion.div
            className="mt-0 w-full bg-black md:-mt-32 md:order-2 md:w-1/2"
            initial="hidden"
            animate="visible"
            variants={imageVariants}
          >
            <div className="h-[clamp(22rem,72vh,36rem)] w-full overflow-hidden bg-black md:h-[clamp(28rem,80vh,48rem)]">
              <Lanyard
                position={[0, 0, 20]}
                gravity={[0, -40, 0]}
                frontImage="/headshot.png"
                imageFit="cover"
                paused={lanyardPaused}
              />
            </div>
          </motion.div>

          {/* Left (desktop): ScrollReveal intro, vertically centered against the Lanyard */}
          <div className="flex w-full items-center justify-center px-6 md:order-1 md:w-1/2 md:justify-start">
            <div className="max-w-xl">
              <ScrollReveal
                baseOpacity={0}
                enableBlur={true}
                baseRotation={3}
                blurStrength={8}
                rotationEnd="+=400"
                wordAnimationEnd="+=400"
              >
                Wrote my first line of code not knowing what a semicolon was. Now I ship full websites and still forget the semicolon sometimes. Growth.
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
