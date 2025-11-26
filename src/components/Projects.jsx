import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Landing from "/src/assets/photos/landingPhoto.png";
import ecommerce from "/src/assets/photos/e-commerce.png"
import movie from "/src/assets/photos/movie app.png"
import coffee from "/src/assets/photos/coffee.png"
import Ripon from "/src/assets/photos/Ripon.jpeg"
import Reviewfy from "/src/assets/photos/reviewfy.png"
import Peace from "/src/assets/photos/peace.png"
import Tic from "/src/assets/photos/tiktac.png"
import Nova from "/src/assets/photos/nova.png"


const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

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

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const projectData = [
    {
      id: "1",
      title: "landing Page-VastuSpaze",
      description:
        "A modern React js based portfolio website for showcasing home renovation and interior design services.",
      link: "https://vastuspaze-react.netlify.app/",
      imgSrc: Landing,
      category: "react",
    },
    {
      id: "2",
      title: "Tic Tac Toe",
      description: "A responsive browser-based Tic-Tac-Toe app that allows players to compete against each other on any device.",
      link: "https://tic-tac-toe-gill.netlify.app/",
      imgSrc: Tic,
      category: "react",
    },
    {
      id: "3",
      title: "E-commerce Website",
      description: "This is a simple e-commerce website built with React.It demonstrates a basic online store setup where users can browse products, add them to the cart, and proceed with a checkout flow.",
      link: "https://ecommerce-reacjst.netlify.app/",
      imgSrc: ecommerce,
      category: "react",
    },
    {
      id: "4",
      title: "Movie Website",
      description: "This movie website is a small React application that lists movies, lets users search and view movie details, and demonstrates modern front-end practices.",
      link: "https://moviee-app-reactjs.netlify.app/",
      imgSrc: movie,
      category: "react",
    },
    {
      id: "5",
      title: "Coffee Website",
      description: "Coffee Web React is a modern and responsive website built with React.js, designed for a coffee shop or café. It highlights a simple yet elegant layout with sections for the menu, coffee varieties, images, and contact information.",
      link: "https://coffee-web-react.netlify.app/",
      imgSrc: coffee,
      category: "react",
    },
    {
      id: "6",
      title: "Ripon Cathedral",
      description: "Official website of a historic 7th-century cathedral in England, offering worship details, events, donations, and visitor information.",
      link: "https://riponcathedral.org.uk/",
      imgSrc: Ripon,
      category: "wordpress",
    },
    {
      id: "7",
      title: "Peace Technology",
      description: "A Karachi-based IT solutions firm providing ERP systems, SharePoint consulting, digital marketing, and custom web development to support business growth.",
      link: "https://peacetechnology.net/",
      imgSrc: Peace,
      category: "wordpress",
    },
    {
      id: "8",
      title: "Reviewfy.ai",
      description: "An AI-powered platform for collecting and managing customer reviews, featuring automated review requests and analytics to improve brand reputation.",
      link: "https://reviewfy.ai/home",
      imgSrc: Reviewfy,
      category: "wordpress",
    },
    {
      id: "9",
      title: "Nova City",
      description: "A visionary real-estate project by Nova Group offering affordable luxury plots and modern living, strategically located near Islamabad International Airport.",
      link: "https://novacity.pk/",
      imgSrc: Nova,
      category: "wordpress",
    },
  ];

  // Filter projects based on active category
  const filteredProjects = activeCategory === "all"
    ? projectData
    : projectData.filter(project => project.category === activeCategory);

  return (
    <section className="p-6 sm:p-10" id="projects">
      <motion.h2
        className="my-8 text-center text-3xl lg:text-8xl "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={headingVariants}
      >
        My Work
      </motion.h2>

      {/* Mobile Dropdown - Premium Dark Design with Deep Glassmorphism */}
      <div className="sm:hidden relative mb-8 px-4" ref={dropdownRef}>
        {/* Dropdown Trigger Button */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setDropdownOpen(false);
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setDropdownOpen(!dropdownOpen);
            }
          }}
          aria-expanded={dropdownOpen}
          aria-label="Filter projects by category"
          className={`w-full px-6 py-4 text-sm sm:text-base rounded-xl font-semibold uppercase tracking-wide 
          transition-all duration-300 flex items-center justify-between
          ${dropdownOpen 
            ? (activeCategory === "all" ? "bg-white text-black" : "bg-gray-800 text-white border-gray-600/50") 
            : (activeCategory === "all" ? "bg-white text-black" : "bg-gray-800 text-white")
          }
          hover:bg-gray-700 border-2 border-gray-700/50 shadow-lg`}
        >
          <span className="truncate">
            {activeCategory === "all" && "All Projects"}
            {activeCategory === "react" && "Website Development"}
            {activeCategory === "wordpress" && "WordPress Development"}
          </span>
          
          {/* Animated Chevron Icon */}
          <svg 
            className={`w-5 h-5 ml-2 transition-transform duration-300 flex-shrink-0 
            ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </button>
        
        {/* Dropdown Menu - Premium Dark Animated */}
        <div className={`
          absolute left-0 right-0 mt-2 rounded-xl overflow-hidden
          transition-all duration-300 origin-top z-50
          ${dropdownOpen 
            ? 'opacity-100 scale-y-100 translate-y-0' 
            : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
          }
        `}>
          {/* Backdrop with blur effect - Deep Dark Theme */}
          <div className="bg-gray-800/98 backdrop-blur-xl border-2 border-gray-700/50 shadow-[0_20px_70px_rgba(0,0,0,0.9)] rounded-xl overflow-hidden">
            
            {/* Dropdown Option: All Projects */}
            <button
              onClick={() => {
                setActiveCategory("all");
                setDropdownOpen(false);
              }}
              className={`
                w-full px-6 py-4 text-left text-sm sm:text-base font-semibold uppercase tracking-wide
                transition-all duration-200 border-b border-gray-700/30 last:border-b-0
                ${activeCategory === "all" 
                  ? "bg-white text-black" 
                  : "text-white hover:bg-gray-700/60 active:bg-gray-700"
                }
              `}
            >
              <span className="flex items-center justify-between">
                <span>All Projects</span>
                {activeCategory === "all" && (
                  <svg className="w-5 h-5 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
            </button>
            
            {/* Dropdown Option: Website Development */}
            <button
              onClick={() => {
                setActiveCategory("react");
                setDropdownOpen(false);
              }}
              className={`
                w-full px-6 py-4 text-left text-sm sm:text-base font-semibold uppercase tracking-wide
                transition-all duration-200 border-b border-gray-700/30 last:border-b-0
                ${activeCategory === "react" 
                  ? "bg-white text-black" 
                  : "text-white hover:bg-gray-700/60 active:bg-gray-700"
                }
              `}
            >
              <span className="flex items-center justify-between">
                <span>Website Development</span>
                {activeCategory === "react" && (
                  <svg className="w-5 h-5 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
            </button>
            
            {/* Dropdown Option: WordPress Development */}
            <button
              onClick={() => {
                setActiveCategory("wordpress");
                setDropdownOpen(false);
              }}
              className={`
                w-full px-6 py-4 text-left text-sm sm:text-base font-semibold uppercase tracking-wide
                transition-all duration-200 border-b border-gray-700/30 last:border-b-0
                ${activeCategory === "wordpress" 
                  ? "bg-white text-black" 
                  : "text-white hover:bg-gray-700/60 active:bg-gray-700"
                }
              `}
            >
              <span className="flex items-center justify-between">
                <span>WordPress Development</span>
                {activeCategory === "wordpress" && (
                  <svg className="w-5 h-5 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Buttons - Hidden on mobile, visible on screens >= 640px */}
      <motion.div
        className="hidden sm:flex flex-wrap justify-center gap-6 mb-6 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={containerVariants}
      >
        <motion.button
          onClick={() => setActiveCategory("all")}
          className={`px-6 py-3 text-base rounded-xl font-semibold uppercase tracking-wide transition-all duration-300 cursor-pointer ${activeCategory === "all"
            ? "bg-white text-black"
            : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          All Projects
        </motion.button>
        <motion.button
          onClick={() => setActiveCategory("react")}
          className={`px-6 py-3 text-base rounded-xl font-semibold uppercase tracking-wide transition-all duration-300 cursor-pointer ${activeCategory === "react"
            ? "bg-white text-black"
            : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Website Development
        </motion.button>
        <motion.button
          onClick={() => setActiveCategory("wordpress")}
          className={`px-6 py-3 text-base rounded-xl font-semibold uppercase tracking-wide transition-all duration-300 cursor-pointer ${activeCategory === "wordpress"
            ? "bg-white text-black"
            : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          WordPress Development
        </motion.button>
      </motion.div>

      {/* Empty State */}
      {filteredProjects.length === 0 ? (
        <motion.p
          className="text-center text-gray-400 text-xl my-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No projects found in this category.
        </motion.p>
      ) : (
        /* Masonry layout */
        <motion.div
          className="columns-1 sm:columns-2 lg:columns-3 gap-6"
          key={activeCategory}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {filteredProjects.map((project, index) => (
            <motion.a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block break-inside-avoid"
              variants={itemVariants}
              custom={index}
            >
              <motion.div
                className="relative mb-6 overflow-hidden rounded-xl shadow-lg transition-transform duration-300"
                whileHover="hover"
                variants={cardVariants}
              >
                <img
                  src={project.imgSrc}
                  alt={project.title}
                  className="h-auto w-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute bottom-0 left-0 right-0 
                       bg-gradient-to-t from-black/90 via-black/70 to-transparent
                       backdrop-blur-sm p-3 sm:p-6 ">

                  <h3 className="text-base sm:text-xl font-semibold text-white">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-base text-white/90">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            </motion.a>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default Projects;
