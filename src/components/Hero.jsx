import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
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
        <motion.h1
          className="mt-16 overflow-hidden text-[12vw] font-semibold uppercase leading-none"
          initial="hidden"
          animate="visible"
          variants={headingVariants}
        >
          Abisha <br />
          Gill
        </motion.h1>
        <motion.div
          className="mt-8"
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
        <motion.div
          className="w-full"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        >
          <img
            className="mt-8 h-[100%] w-full object-cover"
            src="/abisha2.jpg"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
