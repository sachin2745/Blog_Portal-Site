"use client";
import React, { useEffect, useState, Fragment } from "react";
import { Menu, Transition } from '@headlessui/react';
import { FaUser } from "react-icons/fa";
import { HiLogout } from "react-icons/hi";
import { HiOutlineBookmark } from "react-icons/hi";
import { IoMdSearch } from "react-icons/io";
import Link from "next/link";
import useAppContext from "@/context/AppContext";
import { useRouter } from "next/navigation";

const Headers = () => {
    const { logout, loggedIn, currentUser } = useAppContext();
    const [googleUser, setGoogleUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isClient, setIsClient] = useState(false); // Client-side only flag
    const router = useRouter();
    const defaultLogo = "/default-logo.png";

    useEffect(() => {
        // Set client-side flag to true
        setIsClient(true);

        // Fetch user data on client-side
        const getUser = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/success`, { credentials: 'include' });
                const data = await response.json();
                setGoogleUser(data.user);
            } catch (error) {
                console.log("error", error);
            }
        };

        getUser();
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [router.asPath]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(router.asPath.split('?')[1]);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        router.push(`/search?${searchQuery}`);
    };


    const handleLogout = () => {
        if (googleUser) {
            window.open(`${process.env.NEXT_PUBLIC_API_URL}/logout`, "_self");
        } else if (loggedIn) {
            logout();
        }
    };

    const displayLoginOptions = () => {
        const user = googleUser || currentUser;
        if (user) {
            const imageUrl = user.image ? user.image : `${process.env.NEXT_PUBLIC_API_URL}/${currentUser?.avatar}`;
            return (
                <div className="relative inline-flex">
                    <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className="py-1 ps-1 pe-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-full border-2 border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                            <img
                                className="w-8 h-auto rounded-full"
                                src={imageUrl}
                                alt={user.name || user.displayName}
                                onError={(e) => { e.target.onerror = null; e.target.src = defaultLogo; }}
                            />
                            <span className="text-gray-900 font-bold font-Josefin_Sans hidden sm:block text-md truncate max-w-[7.5rem]">
                                {currentUser?.name || user.displayName}
                            </span>
                            <svg
                                className="hs-dropdown-open:rotate-180 size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </Menu.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <Menu.Item>
                                    {({ active }) => (
                                        <div className={` block sm:hidden bg-black text-white px-4 py-2 text-md ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}>
                                            <span className="block truncate font-Josefin_Sans text-md font-medium">  {currentUser?.name || user.displayName}</span>
                                        </div>
                                    )}
                                </Menu.Item>
                                <div className="py-1 font-Josefin_Sans">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <div className={`block px-4 py-2 text-md ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}>
                                                <span className="block truncate text-md font-medium">{user.email}</span>
                                            </div>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href={'/dashboard?tab=profile'}
                                                className={`block px-4 py-2 text-md ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                                            >
                                                <FaUser className="inline-block w-5 h-4 mr-2" />
                                                Profile
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={handleLogout}
                                                className={`block w-full text-left px-4 py-2 text-md ${active ? 'bg-red-200 text-gray-900' : 'text-gray-700'}`}
                                            >
                                                <HiLogout className="inline-block w-5 h-5 mr-2" />
                                                Log out
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            );
        } else {
            return (
                <Link
                    href="/Login"
                    className="font-Syne overflow-hidden relative px-4 py-2 bg-gradient-to-r from-spaceblack to-quaternary text-white rounded-md text-xl font-bold cursor-pointer z-10"
                >
                    Login
                </Link>
            );
        }
    };

    return (
        <div className="shadow-md bg-white duration-200 relative z-40 px-4 py-2 max-w-screen-2xl">
            <div className=" flex justify-between items-center">
                <Link href="/" className="flex items-center justify-between mr-4">
                    <img
                        src="/logo.png"
                        className="  h-14  md:h-full   md:mr-3 rounded-full bg-black"
                        alt="Logo"
                    />
                    <span className="self-center text-3xl md:text-4xl font-[700] font-Style_Script white-nowrap text-spaceblack">
                        Blog <span className="font-Clicker_Scrip text-4xl md:text-5xl">Portal</span>
                    </span>
                </Link>

                <div className="flex justify-between items-center gap-4">
                    <form onSubmit={handleSubmit} className="relative group hidden md:block">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-500 px-2 py-1 focus:outline-none focus:border-1 focus:border-primary"
                        />
                        <button type="submit" className="absolute top-1/2 -translate-y-1/2 right-3">
                            <IoMdSearch className="text-gray-600 group-hover:text-primary" />
                        </button>
                    </form>

                    <Link
                        href="/"
                        className="bg-white hover:bg-spaceblack transition-all duration-300 outline py-1 px-4 rounded-full md:flex items-center gap-3 group hidden md:block"
                    >
                        <span className="group-hover:block font-Syne font-normal text-lg text-black group-hover:text-white hidden transition-all duration-300">
                            Wishlist
                        </span>
                        <span className="relative scale-75">
                            <HiOutlineBookmark className="text-2xl text-black group-hover:text-white drop-shadow-sm cursor-pointer" />
                            <span className="absolute -top-2 left-4 rounded-full bg-mate_black p-0.5 px-2 text-sm "></span>
                        </span>
                    </Link>

                    {/* Search form and other components */}
                    {isClient && displayLoginOptions()} {/* Ensure displayLoginOptions only runs on client */}
                </div>
            </div>
        </div>
    );
};

export default Headers;
