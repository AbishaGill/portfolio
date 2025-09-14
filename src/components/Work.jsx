import React from "react";

const Work = () => {
  return (
    <section id="experience">
      <h2 className="my-10 text-center text-3xl lg:text-8xl">
        Work Experience
      </h2>
      <div className="mx-auto max-w-6xl">
        <div className="mx-4 m-20">
          <h2 className="font-medium lg:text-2xl">Codantix Tech</h2>
          <div className="flex justify-between">
            <p className="py-4 tracking-wide lg:text-xl">
              Web Development Intern (remote)
            </p>
            <p className="py-4 lg:text-xl">8/2025 - 9/2025</p>
          </div>
          <p className="font-sans text-gray-400">
            During my internship at Codantix, I contributed to real-world web
            development projects using React.js. I focused on building clean,
            responsive user interfaces and improving the overall user experience
            through reusable components and modern design practices. This role
            gave me practical exposure to frontend development workflows,
            collaboration through Git/GitHub, and the opportunity to turn
            creative ideas into functional solutions while working in a
            professional environment.
          </p>
        </div>
        <div className="mx-4 m-20">
          <h2 className="font-medium lg:text-2xl">
            GitHub | React.js Projects
          </h2>
          <div className="flex justify-between">
            <p className="py-4 tracking-wide lg:text-xl">
              Open Source Contributor
            </p>
            <p className="py-4 lg:text-xl">2024 - Present</p>
          </div>
          <p className="font-sans text-gray-400">
            I’ve contributed to open-source projects on GitHub, particularly
            within the React.js ecosystem. My focus has been on improving
            frontend features, fixing bugs, and collaborating with the community
            to make projects more user-friendly and accessible. Through these
            contributions, I gained experience in writing reusable React
            components, following accessibility standards, and managing code
            with Git and GitHub. Contributing to open-source has not only
            improved my technical skills but also taught me how to work with
            developers around the world on real-world projects.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Work;
