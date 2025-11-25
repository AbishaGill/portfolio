import React, { useState } from "react";
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
    {
      // id: "10",
      // title: "Real Estate Listing Site",
      // description: "Comprehensive WordPress real estate platform with property listings, advanced search filters, and virtual tour integration. Includes agent profiles and contact forms for seamless client communication.",
      // link: "#",
      // imgSrc: Landing,
      // category: "wordpress",
    },
  ];

  // Filter projects based on active category
  const filteredProjects = activeCategory === "all"
    ? projectData
    : projectData.filter(project => project.category === activeCategory);

  return (
    <section className="p-6 sm:p-10" id="projects">
      <h2 className="my-8 text-center text-3xl lg:text-8xl ">
        My Work
      </h2>

      {/* Category Filter Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mb-8 sm:mb-6 px-4">
        <button
          onClick={() => setActiveCategory("all")}
          className={`w-full sm:w-auto px-4 sm:px-6 py-3 text-xs sm:text-base rounded-xl font-semibold uppercase tracking-wide transition-all duration-300 ${activeCategory === "all"
            ? "bg-white text-black"
            : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
        >
          All Projects
        </button>
        <button
          onClick={() => setActiveCategory("react")}
          className={`w-full sm:w-auto px-4 sm:px-6 py-3 text-xs sm:text-base rounded-xl font-semibold uppercase tracking-wide transition-all duration-300 ${activeCategory === "react"
            ? "bg-white text-black"
            : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
        >
          Website Development
        </button>
        <button
          onClick={() => setActiveCategory("wordpress")}
          className={`w-full sm:w-auto px-4 sm:px-6 py-3 text-xs sm:text-base rounded-xl font-semibold uppercase tracking-wide transition-all duration-300 ${activeCategory === "wordpress"
            ? "bg-white text-black"
            : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
        >
          WordPress Development
        </button>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 ? (
        <p className="text-center text-gray-400 text-xl my-8">
          No projects found in this category.
        </p>
      ) : (
        /* Masonry layout */
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {filteredProjects.map((project) => (
            <a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block break-inside-avoid"
            >
              <div className="relative mb-6 overflow-hidden rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-300">
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
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
};

export default Projects;
