"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import Hero from '../Hero/page';

const fetchPostData = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/getall`);
    const data = await response.json();
    return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (err) {
    console.error(err);
    return [];
  }
};

const Home = () => {
  const [postArray, setPostArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPostData().then((posts) => {
      setPostArray(posts);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Hero />
      
      <section className="text-gray-600 body-font bg-mate_black dark:bg-primary">
        <div className="text-center font-Jost text-black dark:text-black pt-10">
          <h1 className="font-bold text-3xl font-Montserrat">My Blog</h1>
          <h3 className="text-sm font-Montserrat ">Home &rsaquo; My Blog</h3>
        </div>

        <div className="container px-5 py-24 mx-auto">
          {loading ? (
            <div className="flex flex-wrap -m-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-4 md:w-1/3">
                  <div className="h-full relative border-2 shadow-xl border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                    <div className="lg:h-48 md:h-36 w-full bg-gray-300" />
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 mb-2" />
                      <div className="h-4 bg-gray-300 mb-2 w-1/2" />
                      <div className="h-16 bg-gray-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap -m-4">
              {postArray.map((post, index) => (
                <div key={post._id} className="p-4 md:w-1/3 ">
                  <div className="h-full relative border-2 shadow-xl  overflow-hidden border-gray-200 border-opacity-60 rounded-lg ">
                    <img
                      className="lg:h-48 md:h-36 w-full object-cover opacity-75  block transition duration-200 ease-out transform hover:opacity-100"
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${post.image}`}
                      alt="blog"
                    />
                    <span className="absolute font-Oswald outline top-0 z-10 left-0 m-3 rounded-sm bg-transparent tracking-wide px-2 text-center text-sm font-bold text-white">
                      Blog {index + 1}
                    </span>
                    <div className="p-6 font-Josefin_Sans">
                      <div className='flex justify-between mb-3'>
                        <h2 className="tracking-widest text-xs title-font font-medium text-gray-600 ">
                          CATEGORY
                        </h2>
                        <h1 className="title-font text-xs tracking-widest font-medium text-gray-600  uppercase">
                          {post.category}
                        </h1>
                      </div>
                      <h2 className="leading-relaxed mb-3 font-Montserrat font-bold line-clamp-* capitalize">
                        {post.title}
                      </h2>
                      <div className="flex items-center flex-wrap  ">
                        <Link
                          href={"/Viewblog/" + post._id}
                          className="text-quaternary  hover:text-white bg-white hover:bg-quaternary px-2 py-2  rounded-md transition ease-in-out  duration-300  transform  inline-flex items-center md:mb-0 lg:mb-0"
                        >
                          Learn More <MdKeyboardDoubleArrowRight />

                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
