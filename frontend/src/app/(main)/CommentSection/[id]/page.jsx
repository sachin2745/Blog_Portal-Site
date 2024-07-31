"use client";

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Button, Textarea, Modal, Dropdown } from 'flowbite-react';
import useAppContext from '@/context/AppContext';
import { useParams, useRouter } from 'next/navigation';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { BiDotsVertical } from "react-icons/bi";
import  './comment.css';

const CommentInput = () => {
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const { id } = useParams();
    const { currentUser } = useAppContext();
    const router = useRouter();

    const fetchComments = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/comment/getpostcomments/${id}`;
        console.log("Fetching comments from URL:", url);
        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            console.log('Fetched comments:', data);
            setComments(data.map(comment => ({
                ...comment,
                liked: comment.likes.includes(currentUser?.id) // Add liked state
            })));
        } catch (error) {
            console.error("Error fetching comments:", error);
            toast.error("Failed to load comments");
        }
    };

    useEffect(() => {
        if (id) {
            fetchComments();
        } else {
            console.error("id is undefined");
        }
    }, [id]);

    const commentSchema = Yup.object().shape({
        name: Yup.string().required('Name is Required').min(3, 'Name is Too Short'),
        content: Yup.string().required('Content is Required').min(5, 'Content is Too Short'),
    });

    const commentForm = useFormik({
        initialValues: {
            name: '',
            content: '',
        },
        onSubmit: async (values) => {
            if (!currentUser) {
                router.push('/Login');
                return;
            }

            const url = `${process.env.NEXT_PUBLIC_API_URL}/comment/add`;
            console.log("Posting comment to URL:", url);
            try {
                const res = await fetch(url, {
                    method: "POST",
                    body: JSON.stringify({
                        ...values,
                        postId: id,
                        userId: currentUser.id,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        'x-auth-token': currentUser.token,
                    },
                });

                if (res.ok) {
                    toast.success("Comment Added");
                    commentForm.resetForm();
                    fetchComments(); // Refetch comments after posting
                } else {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
            } catch (error) {
                console.error("Error posting comment:", error);
                toast.error("Failed to post comment");
            }
        },
        validationSchema: commentSchema,
    });

    const handleDelete = async (commentId) => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/comment/delete/${commentId}`;
        console.log("Deleting comment from URL:", url);
        try {
            const res = await fetch(url, {
                method: "DELETE",
                headers: {
                    'x-auth-token': currentUser.token,
                },
            });

            if (res.ok) {
                toast.success("Comment Deleted Successfully");
                setComments(comments.filter((comment) => comment._id !== commentId));
                setShowModal(false);
            } else {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast.error("Failed to delete comment");
        }
    };

    const handleLike = async (commentId) => {
        console.log(`Liking/unliking comment with ID: ${commentId}`);
        const url = `${process.env.NEXT_PUBLIC_API_URL}/comment/like/${commentId}`;
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    'x-auth-token': currentUser.token,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Error response from server:", errorData);
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const updatedComment = await res.json();
            console.log("Updated comment:", updatedComment);
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment._id === commentId
                        ? { ...comment, liked: !comment.liked, numberOfLikes: updatedComment.numberOfLikes } // Toggle liked state
                        : comment
                )
            );
        } catch (error) {
            console.error("Error liking/unliking comment:", error);
            toast.error("Failed to like/unlike comment");
        }
    };

    const handleEdit = (commentId) => {
        // Implement edit functionality here
    };

    return (
        <>
            <div className='max-w-5xl mx-auto mb-20'>
                <div className='border-2 border-black rounded-lg p-3'>
                    <h1 className='text-center text-4xl my-7 font-extrabold font-Josefin_Sans'>Leave a Comment</h1>
                    <form className='flex flex-col gap-4 font-Montserrat' onSubmit={commentForm.handleSubmit}>
                        <div>
                            <div className='mb-4'>
                                <input type='text' id='name'
                                    placeholder='Name'
                                    autoComplete='off'
                                    value={commentForm.values.name}
                                    onChange={commentForm.handleChange}
                                    className='outline outline-1 block w-full rounded-md border-0 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-spaceblack/80 sm:text-sm sm:leading-6' />
                                {commentForm.touched.name && (
                                    <span className="text-red-500 font-Jost">
                                        {commentForm.errors.name}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Textarea
                                    placeholder='Write your comment here...'
                                    id='content'
                                    value={commentForm.values.content}
                                    onChange={commentForm.handleChange}
                                    onBlur={commentForm.handleBlur}
                                    className="outline outline-1 block w-full rounded-md border-0 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-spaceblack/80 sm:text-sm sm:leading-6"
                                />
                                {commentForm.touched.content && (
                                    <span className="text-red-500 font-Jost">
                                        {commentForm.errors.content}
                                    </span>
                                )}
                            </div>
                        </div>
                        <Button type='submit' gradientDuoTone='greenToBlue'>
                            Post Comment
                        </Button>
                    </form>
                </div>

                <div className='text-sm my-5 flex items-center gap-1 font-Montserrat font-medium'>
                    <p>Comments</p>
                    <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                        <p>{comments.length}</p>
                    </div>
                </div>

                <div className='  text-center mx-auto'>
                    <p className='text-4xl my-7 font-extrabold font-Josefin_Sans'>All comments on this post</p>
                </div>

                {comments.length === 0 ? (
                    <p className='text-sm my-5 font-Montserrat font-medium text-center'>No comments yet!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="p-4 md:max-w-6xl">
                            <div className="h-full border-b-4 border-t-2 border-s-2 border-e-2 border-gray-900 border-opacity-60 rounded-lg p-4">
                                <div className='flex justify-between'>
                                    <div>
                                        <h2 className="text-xl font-bold font-Montserrat text-quaternary">
                                            {comment.name} {/* Display the name of the commenter */}
                                        </h2>

                                        <p className="text-sm text-neutral-800 font-Syne">
                                            Posted on {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>

                                    <div className="cursor-pointer">
                                        <Dropdown placement="right-start" size="xl" renderTrigger={() => <span><BiDotsVertical className='text-3xl' /></span>} label="">
                                            <Dropdown.Item className=''>
                                                <span
                                                    onClick={() => handleEdit(comment._id)}
                                                    className=" px-6 py-2 text-md  text-black font-Montserrat font-semibold hover:bg-gray-100  "
                                                >
                                                    Edit
                                                </span>
                                            </Dropdown.Item>
                                            <Dropdown.Divider className='bg-quaternary/10 h-1' />
                                            <Dropdown.Item>
                                                <span
                                                    onClick={() => {
                                                        setShowModal(true);
                                                        setCommentToDelete(comment._id);
                                                    }}
                                                    className="block px-6 py-2 text-md  text-red-600 font-Montserrat  font-semibold hover:bg-gray-100 "
                                                >
                                                    Delete
                                                </span>
                                            </Dropdown.Item>
                                        </Dropdown>
                                    </div>
                                </div>
                                <p className="leading-relaxed mb-6 font-medium font-Montserrat">{comment.content}</p>

                                <div className='flex justify-start items-center'>
                                    <button
                                        className="flex"
                                        onClick={() => handleLike(comment._id)}
                                    >
                                        <label className="ui-like">
                                            <input type="checkbox" />
                                            <div className="like">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="">
                                                    <g strokeWidth={0} id="SVGRepo_bgCarrier" />
                                                    <g
                                                        strokeLinejoin="round"
                                                        strokeLinecap="round"
                                                        id="SVGRepo_tracerCarrier"
                                                    />
                                                    <g id="SVGRepo_iconCarrier">
                                                        <path d="M20.808,11.079C19.829,16.132,12,20.5,12,20.5s-7.829-4.368-8.808-9.421C2.227,6.1,5.066,3.5,8,3.5a4.444,4.444,0,0,1,4,2,4.444,4.444,0,0,1,4-2C18.934,3.5,21.773,6.1,20.808,11.079Z" />
                                                    </g>
                                                </svg>
                                            </div>
                                        </label>

                                        &nbsp;
                                        <span className='font-Syne text-xl font-semibold text-neutral-800 -mt-1'>
                                            {comment.numberOfLikes}
                                        </span>
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))
                )}

                <Modal show={showModal} size="md" popup={true} onClose={() => setShowModal(false)}>
                    <Modal.Header />
                    <Modal.Body>
                        <div className="text-center">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Are you sure you want to delete this comment?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button
                                    color="failure"
                                    onClick={() => {
                                        handleDelete(commentToDelete);
                                    }}
                                >
                                    Yes, I'm sure
                                </Button>
                                <Button color="gray" onClick={() => setShowModal(false)}>
                                    No, cancel
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
}

export default CommentInput;
