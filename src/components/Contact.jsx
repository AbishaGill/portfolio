import React from "react";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Contact = () => {
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

  const emailVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        duration: 0.3,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.4,
      },
    },
  };

  return (
    <section id="contact">
      <div className="mx-auto max-w-6xl">
        <motion.p
          className="my-10 text-center text-3xl lg:text-8xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headingVariants}
        >
          Interested In Working Together?
        </motion.p>
        <motion.p
          className="my-4 text-center text-2xl font-medium text-lime-300 lg:pt-6 lg:text-5xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={emailVariants}
        >
          gillabisha4@gmail.com
        </motion.p>
        <motion.div
          className="mt-20 flex items-center justify-center gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
        >
          <motion.a
            href="https://github.com/AbishaGill"
            target="_blank"
            rel="noopener noreferrer"
            variants={iconVariants}
            whileHover="hover"
          >
            <FaGithub className="text-5xl" />
          </motion.a>
          <motion.a
            href="https://linkedin.com/in/abisha-gill-5a317a295/"
            target="_blank"
            rel="noopener noreferrer"
            variants={iconVariants}
            whileHover="hover"
          >
            <FaLinkedin className="text-5xl " />
          </motion.a>
        </motion.div>
      </div>
      <motion.p
        className="my-8 text-center text-gray-400"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        &copy; Abisha Gill. All rights reserved.
      </motion.p>
    </section>
  );
};

export default Contact;
