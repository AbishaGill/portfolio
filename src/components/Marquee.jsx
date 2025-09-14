import React from "react";
import { motion } from "framer-motion";

const Marquee = () => {
  return (
    <div className="mt-4 w-full bg-lime-300 text-black lg:py-6 ">
      <div className="flex overflow-hidden whitespace-nowrap">
        <motion.h1
          initial={{ x: "-100%" }}
          animate={{ x: "0" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30,
            repeatDelay: 0,
          }}
          className="py-2 text-3xl font-bold leading-none tracking-tigher lg:text-7xl"
        >
          REACT · TAILWIND · JAVASCRIPT · HTML · CSS · GIT · GITHUB · WORDPRESS · REACT ·
          TAILWIND · JAVASCRIPT · HTML · CSS · GIT · GITHUB ·  WORDPRESS · REACT · TAILWIND ·
          JAVASCRIPT · HTML · CSS · GIT · GITHUB ·  WORDPRESS · REACT · TAILWIND · JAVASCRIPT
          · HTML · CSS · GIT · GITHUB · WORDPRESS 
        </motion.h1>
      </div>
    </div>
  );
};

export default Marquee;
