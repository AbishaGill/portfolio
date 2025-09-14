import React from "react";
import Landing from "/src/assets/photos/landingPhoto.png";
import ContactForm from "/src/assets/photos/contactform-reactjs.netlify.app_ (1).png";
import ecommerce from "/src/assets/photos/e-commerce.png"
import movie from "/src/assets/photos/movie app.png"
import coffee from "/src/assets/photos/coffee.png"

const Projects = () => {
  const projectData = [
    {
      id: "1",
      title: "landing Page-VastuSpaze",
      description:
        "A modern React js based portfolio website for showcasing home renovation and interior design services.",
      link: "https://vastuspaze-react.netlify.app/",
      imgSrc: Landing,
    },
    {
      id: "2",
      title: "Contact Form",
      description: "A simple and responsive React contact form.",
      link: "https://contactform-reactjs.netlify.app/",
      imgSrc: ContactForm,
    },
    {
      id: "3",
      title: "E-commerce Website",
      description: "This is a simple e-commerce website built with React.It demonstrates a basic online store setup where users can browse products, add them to the cart, and proceed with a checkout flow.",
      link: "https://contactform-reactjs.netlify.app/",
      imgSrc: ecommerce,
    },
    {
      id: "4",
      title: "Movie Website",
      description: "This movie website is a small React application that lists movies, lets users search and view movie details, and demonstrates modern front-end practices.",
      link: "https://moviee-app-reactjs.netlify.app/",
      imgSrc: movie,
    },
    {
      id: "4",
      title: "Coffee Website",
      description: "Coffee Web React is a modern and responsive website built with React.js, designed for a coffee shop or café. It highlights a simple yet elegant layout with sections for the menu, coffee varieties, images, and contact information.",
      link: "https://coffee-web-react.netlify.app/",
      imgSrc: coffee,
    },
  ];

  return (
    <section className="p-6 sm:p-10" id="projects">
    <h2 className="my-8 text-center text-3xl sm:text-4xl lg:text-6xl font-bold">
      My Work
    </h2>

    {/* Masonry layout */}
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      {projectData.map((project) => (
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
                      text-black  
                     backdrop-blur-md p-3 sm:p-6 ">
  
  <h3 className="text-base sm:text-xl ">
    {project.title}
  </h3>
  
  <p className="text-xs sm:text-base opacity-90">
    {project.description}
  </p>
</div>
          </div>
        </a>
      ))}
    </div>
  </section>
  );
};

export default Projects;
