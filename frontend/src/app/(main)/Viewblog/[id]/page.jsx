'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Use the correct import for useParams
import Link from 'next/link';
import CommentInput from '../../CommentSection/[id]/page';

const Viewblog = () => {
    const { id } = useParams(); // Extract id from useParams
    const [blogList, setBlogList] = useState({});
    const [recentPosts, setRecentPosts] = useState([]);

    const getProductData = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/getbyid/${id}`);
            console.log(res.status);

            if (res.ok) {
                const data = await res.json();
                setBlogList(data);
                console.log(data);
            } else {
                console.error("Failed to fetch blog data");
            }
        } catch (error) {
            console.error("Error fetching blog data:", error.message);
        }
    };

    useEffect(() => {
        if (id) {
            getProductData();
        }
    }, [id]);

    useEffect(() => {
        console.log('Current postId:', id); // Check if id is correctly retrieved
    
        if (id) {
            getProductData();
        }
    }, [id]);

    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/getposts?limit=3`);
                if (res.ok) {
                    const data = await res.json();
                    setRecentPosts(data.posts);
                    console.log(data.posts);
                } else {
                    console.error("Failed to fetch recent posts");
                }
            } catch (error) {
                console.error("Error fetching recent posts:", error.message);
            }
        };

        fetchRecentPosts();
    }, []);

    return (
        <div className="mt-6 bg-gray-50">
            <div className="px-0 md:px-10 py-6 mx-auto">
                <div className="max-w-6xl px-5 md:px-10 py-6 mx-auto bg-gray-50">
                    <div className="md:flex justify-between mb-5">
                        <div className="mt-2 flex-initial">
                            <h2 className="sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl font-extrabold font-Montserrat capitalize text-spaceblack">
                                {blogList?.title}
                            </h2>
                        </div>
                        <div className="flex items-center justify-start mt-4 mb-4 cursor-pointer">
                            <span className="px-4 py-2 font-semibold bg-quaternary text-white font-Montserrat rounded-md capitalize hover:scale-110 duration-300 transition ease-in-out mr-4">
                                {blogList?.category}
                            </span>
                        </div>
                    </div>
                    <div className="block transition duration-200 ease-out transform">
                        <img
                            className="object-cover w-full shadow-sm h-full"
                            src={`${process.env.NEXT_PUBLIC_API_URL}/` + blogList?.image}
                            alt="Blog image"
                        />
                    </div>
                    <div className="flex justify-between p-3 border-b border-spaceblack mx-auto w-full max-w-6xl text-sm font-bold tracking-wider font-Style_Script">
                        <span>{blogList?.createdAt && new Date(blogList.createdAt).toLocaleDateString()} Posted</span>
                        <span>
                            {blogList?.content ? (blogList.content.length / 1000).toFixed(0) : 0} mins read
                        </span>
                    </div>
                    <div className="max-w-6xl px-4 md:px-10 mx-auto text-md sm:text-xl md:text-2xl text-gray-800 mt-4 rounded bg-gray-100 font-Montserrat">
                        <div className="">
                            <div className="mt-2 p-8" dangerouslySetInnerHTML={{ __html: blogList?.content || "No content available." }}></div>
                        </div>
                    </div>
                </div>

                {/* Comment Section */}
                {id && <CommentInput postId={id} />}

                {/* My recent blog */}
                <div className="max-w-screen-xl mx-auto">
                    <h1 className="text-3xl mt-4 text-quaternary font-Montserrat font-bold text-center">
                        Recent blogs
                    </h1>
                    <div className="grid h-full md:grid-cols-12 gap-10 px-8 md:px-0 pb-10 mt-8 sm:mt-16">
                        {recentPosts.length > 0 ? (
                            recentPosts.map((post) => (
                                <div key={post._id} className="grid grid-cols-1 md:grid-cols-4 col-span-4 gap-7">
                                    <div className="flex flex-col items-start col-span-12 overflow-hidden shadow-xl rounded-md md:col-span-6 lg:col-span-4">
                                        <Link href={`/Viewblog/${post._id}`} className="block transition duration-200 ease-out transform hover:scale-110">
                                            <img
                                                className="block transition duration-200 ease-out transform hover:scale-110"
                                                src={`${process.env.NEXT_PUBLIC_API_URL}/` + post?.image}
                                                alt="post cover"
                                            />
                                        </Link>
                                        <div className="relative flex flex-col items-start px-6 bg-white w-full border border-t-0 border-gray-200 py-7 rounded-b-2xl">
                                            <div className="bg-black font-Montserrat absolute top-0 -mt-3 flex items-center px-3 py-1.5 leading-none w-auto rounded-sm text-xs font-medium uppercase text-white">
                                                <span>{post.category}</span>
                                            </div>
                                            <h2 className="text-base text-gray-700 font-semibold font-Josefin_Sans sm:text-lg md:text-xl">
                                                <Link href={`/Viewblog/${post._id}`}>{post.title}</Link>
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No recent posts available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Viewblog;
