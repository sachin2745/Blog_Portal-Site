'use client';
import useAppContext from '@/context/AppContext';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import "./viewblog.css";
import DOMPurify from 'dompurify';

const Viewblog = () => {
    const { id } = useParams();
    const [blogList, setBlogList] = useState({});
    const { logout, loggedIn, currentUser } = useAppContext();

    const getProductData = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/getbyid/` + id);
        console.log(res.status);

        const data = await res.json();
        setBlogList(data);
        console.log(data);
    };

    useEffect(() => {
        getProductData();
    }, []);

    return (
        <div className="mt-6 bg-gray-50">
            <div className=" px-0 md:px-10 py-6 mx-auto">
                <div className="max-w-6xl px-5 md:px-10 py-6 mx-auto bg-gray-50">
                    <div className="md:flex justify-between mb-6">
                        <div className="mt-2 flex-initial">
                            <h2 className="sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl font-extrabold font-Montserrat font- capitalize text-spaceblack">
                                {blogList?.title}
                            </h2>
                        </div>
                        <div className="flex items-center justify-start  mt-4 mb-4 cursor-pointer">
                            <span className="px-4 py-2  font-semibold bg-quaternary text-white font-Montserrat rounded-md capitalize hover:scale-110 duration-300 transition ease-in-out mr-4">
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
                    <div className="flex justify-between p-3 border-b border-spaceblack  mx-auto w-full max-w-6xl text-sm font-bold tracking-wider font-Style_Script">
                        <span>{blogList?.createdAt && new Date(blogList.createdAt).toLocaleDateString()} Posted</span>
                        <span className="">
                            {blogList?.content ? (blogList.content.length / 1000).toFixed(0) : 0} mins read
                        </span>
                    </div>
                    <div className="max-w-6xl px-4 md:px-10 mx-auto text-md sm:text-xl md:text-2xl text-gray-800 mt-4 rounded bg-gray-100 font-Montserrat">
                        <div className="">
                            <div
                                className="mt-2 p-4 sm:p-6 md:p-8"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blogList?.content || "No content available.") }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Viewblog;
