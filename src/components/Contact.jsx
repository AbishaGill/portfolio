import React from "react";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
const Contact = () => {
  return (
    <section id="contact">
      <div className="mx-auto max-w-6xl">
        <p className="my-10 text-center text-3xl lg:text-8xl">
          Interested In Working Together?
        </p>
        <p className="my-4 text-center text-2xl font-medium text-lime-300 lg:pt-6 lg:text-5xl">
          gillabisha4@gmail.com
        </p>
        <div className="mt-20 flex items-center justify-center gap-8">
          <a
            href="https://github.com/AbishaGill"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="text-5xl" />
          </a>
          <a
            href="https://linkedin.com/in/abisha-gill-5a317a295/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="text-5xl " />
          </a>
        </div>
      </div>
      <p className="my-8 text-center text-gray-400">
        &copy; Abisha Gill. All rights reserved.
      </p>
    </section>
  );
};

export default Contact;
