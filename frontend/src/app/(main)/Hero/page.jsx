"use client";
import React from 'react'
import "./hero.css";

const Hero = () => {
  return (
    <section className="text-gray-600 body-font max-w-screen-xl mx-auto -mt-10">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 ">
          <h1 className="title-font text-4xl md:text-6xl font-Montserrat  mb-4 font-extrabold text-spaceblack">
            Journey through knowledge

          </h1>
          <p className="mb-8 leading-relaxed font-Syne text-lg text-neutral-700">
            Embark on an enlightening adventure with our curated selection of blog posts. From technology and lifestyle to personal growth and beyond, we bring you content that matters.
          </p>

        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6  ">
          <img
            className="object-cover object-center rounded aspect-square "
            alt="hero"
            src="about.png"
          />
        </div>
      </div>
    </section>


  )
}

export default Hero