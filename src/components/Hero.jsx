import React from "react";

const Hero = () => {
  return (
    <section>
      <div className="flex flex-col items-center justify-center">
        <h1 className="mt-16 overflow-hidden text-[12vw] font-semibold uppercase leading-none">
          Abisha <br />
          Gill
        </h1>
        <div className="mt-8">
          <a
            href="/Abisha_Iqbal_Gill_Resume.docx"
            rel="noopener noreferrer"
            target="_blank"
            download
            className="flex items-center rounded-xl bg-lime-300 p-2 px-9 font-sansfont-medium text-black hover:bg-lime-400"
          >
            <span>Resume</span>
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
                d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
              />
            </svg>
          </a>
        </div>
        <div className="w-full">
          <img
            className="mt-8 h-[100%] w-full object-cover"
            src="/abisha2.jpg"
          />
        </div>
      </div>
    </section>
  );
  s;
};

export default Hero;
