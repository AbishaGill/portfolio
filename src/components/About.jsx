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
          I'm Abisha Gill, a frontend developer with expertise in React.js, React Native, Next.js, and TypeScript. I enjoy turning ideas into interactive, responsive, and visually appealing web and mobile applications using modern tools like Tailwind CSS. Along with building custom WordPress sites using themes, plugins, and custom code, I've also worked on manual and automated QA testing, giving me a well-rounded perspective on both building and validating quality software. I thrive in collaborative, agile remote teams, delivering reusable components and reliable features across multiple projects.
        </motion.p>
      </div>
    </section>
  );
};

export default About;
