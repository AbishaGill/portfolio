import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);
  const containerVariants = {
    hidden: { opacity: 0, y: "-100%" },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: "-50" },
    visible: {
      opacity: 1,
      y: 0,
    },
  };
  return (
    <>
      <div className="fixed right-0 top-0 z-30 p-4">
        <button onClick={toggleMenu} className="rounded-md p-2">
          {isOpen ? (
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          ) : (
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
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
            className="fixed inset-0 z-20 flex flex-col items-center justify-center bg-black text-white"
          >
            <ul className="space-y-8 text-4xl sm:text-6xl font-semibold uppercase tracking-wide">
              <motion.li variants={linkVariants}>
                <a
                  href="#"
                  className="hover:text-lime-300"
                  onClick={toggleMenu}
                >
                  Projects
                </a>
              </motion.li>
              <motion.li variants={linkVariants}>
                <a
                  href="#about"
                  className="hover:text-lime-300"
                  onClick={toggleMenu}
                >
                  About
                </a>
              </motion.li>
              <motion.li variants={linkVariants}>
                <a
                  href="#experience"
                  className="hover:text-lime-300"
                  onClick={toggleMenu}
                >
                  Experience
                </a>
              </motion.li>
              <motion.li variants={linkVariants}>
                <a
                  href="#contact"
                  className="hover:text-lime-300"
                  onClick={toggleMenu}
                >
                  Contact
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
