import React from "react";
import { motion } from "framer-motion";

const About = () => {
  // Animation Variants
  const headingVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="about">
      <motion.h2
        className="my-10 text-center text-3xl lg:text-8xl "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={headingVariants}
      >
        About Me
      </motion.h2>
      <div className="flex items-center justify-center ">
        <motion.p
          className="m-8 max-w-6xl text-3xl lg:text-6xl "
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={textVariants}
        >
        I'm Abisha Gill, a frontend developer with expertise in React.js, WordPress, and GoHighLevel (GHL). I enjoy turning ideas into interactive, responsive, and visually appealing web applications. Along with building custom WordPress sites using themes, plugins, and custom code (HTML, CSS, JavaScript, PHP), I also design funnels and automations in GHL to help businesses streamline marketing and boost growth. This mix of modern frontend skills, CMS flexibility, and automation gives me the ability to deliver complete digital solutions.
        </motion.p>
      </div>
    </section>
  );
};

export default About;
