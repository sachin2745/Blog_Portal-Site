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
import classes from './comment.module.css';

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
            setComments(data);
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

    const handleLike = (commentId) => {
        // Implement like functionality here
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


                                    <div className=" cursor-pointer ">
                                        <Dropdown placement="right-start" size="xl" renderTrigger={() => <span><BiDotsVertical className='text-3xl' /></span>} label="">
                                            <Dropdown.Item className=''>
                                                <button
                                                    onClick={() => handleEdit(comment._id)}
                                                    className=" px-6 py-2 text-md  text-black font-Montserrat font-semibold hover:bg-gray-100  "
                                                >
                                                    Edit
                                                </button>
                                            </Dropdown.Item>
                                            <Dropdown.Divider className='bg-quaternary/10 h-1' />
                                            <Dropdown.Item>
                                                <button
                                                    onClick={() => {
                                                        setShowModal(true);
                                                        setCommentToDelete(comment._id);
                                                    }}
                                                    className="block px-6 py-2 text-md  text-red-600 font-Montserrat  font-semibold hover:bg-gray-100  "
                                                >
                                                    Delete
                                                </button>
                                            </Dropdown.Item>
                                        </Dropdown>
                                    </div>

                                </div>
                                <span className='block bg-black w-56 h-0.5  mt-1 mb-1'></span>

                                <p className="text-quaternary font-Montserrat font-normal  mt-2 mb-4">
                                    {comment.content}
                                </p>
                                <div className='mt-4 flex items-start w-10 gap-2'>
                                    {/* <Button color="blue" onClick={() => handleLike(comment._id)}>Like</Button> */}
                                    <label className={classes.container} >
                                        <input className={classes.input} type="checkbox" onClick={() => handleLike(comment._id)} />
                                        <svg
                                            className={classes.svg}
                                            id="Glyph"
                                            version="1.1"
                                            viewBox="0 0 32 32"
                                            xmlSpace="preserve"
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                        >
                                            <path
                                                d="M29.845,17.099l-2.489,8.725C26.989,27.105,25.804,28,24.473,28H11c-0.553,0-1-0.448-1-1V13  c0-0.215,0.069-0.425,0.198-0.597l5.392-7.24C16.188,4.414,17.05,4,17.974,4C19.643,4,21,5.357,21,7.026V12h5.002  c1.265,0,2.427,0.579,3.188,1.589C29.954,14.601,30.192,15.88,29.845,17.099z"
                                                id="XMLID_254_"
                                            />
                                            <path
                                                d="M7,12H3c-0.553,0-1,0.448-1,1v14c0,0.552,0.447,1,1,1h4c0.553,0,1-0.448,1-1V13C8,12.448,7.553,12,7,12z   M5,25.5c-0.828,0-1.5-0.672-1.5-1.5c0-0.828,0.672-1.5,1.5-1.5c0.828,0,1.5,0.672,1.5,1.5C6.5,24.828,5.828,25.5,5,25.5z"
                                                id="XMLID_256_"
                                            />
                                        </svg>
                                    </label>

                                </div>


                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size='md'
            >
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-red-500  mb-4 mx-auto' />
                        <h3 className='mb-5 text-xl text-gray-700 font-Syne font-medium'>
                            Are you sure you want to delete this comment?
                        </h3>
                        <div className='flex justify-center gap-4 font-Syne'>
                            <Button
                                color='failure'
                                onClick={() => handleDelete(commentToDelete)}
                            >
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CommentInput;
