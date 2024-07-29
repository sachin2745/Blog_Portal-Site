"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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
    <section className="text-gray-600 body-font bg-mate_black dark:bg-primary">
      <div className="text-center font-Jost text-black dark:text-black pt-10">
        <h1 className="font-bold text-3xl">My Blog</h1>
        <h3 className="text-1xl">Home &rsaquo; My Blog</h3>
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
              <div key={post._id} className="p-4 md:w-1/3">
                <div className="h-full relative border-2 shadow-xl border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                  <img
                    className="lg:h-48 md:h-36 w-full object-cover object-center"
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${post.image}`}
                    alt="blog"
                  />
                  <span className="absolute font-Oswald outline top-0 z-10 left-0 m-3 rounded-sm bg-transparent px-2 text-center text-sm font-bold text-white">
                    Blog {index + 1}
                  </span>
                  <div className="p-6 font-Josefin_Sans">
                    <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                      CATEGORY
                    </h2>
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                      {post.category}
                    </h1>
                    <h2 className="leading-relaxed mb-3 line-clamp-*">
                      {post.title}
                    </h2>
                    <div className="flex items-center flex-wrap">
                      <Link
                        href={"/viewblog/" + post._id}
                        className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0"
                      >
                        Learn More
                        <svg
                          className="w-4 h-4 ml-2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="M12 5l7 7-7 7" />
                        </svg>
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
  );
};

export default Home;
