"use client";
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { Button, Textarea, Modal } from 'flowbite-react';
import useAppContext from '@/context/AppContext';
import { useParams, useRouter } from 'next/navigation';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

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
                                    value={commentForm.values.name}
                                    onChange={commentForm.handleChange}
                                    className='outline outline-1 block w-full rounded-md border-0 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary/80 sm:text-sm sm:leading-6' />
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
                                    className="outline outline-1 block w-full rounded-md border-0 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary/80 sm:text-sm sm:leading-6"
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

                <div className='text-sm my-5 flex items-center gap-1'>
                    <p>Comments</p>
                    <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                        <p>{comments.length}</p>
                    </div>
                </div>

                {comments.length === 0 ? (
                    <p className='text-sm my-5'>No comments yet!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="p-4 md:w-1/3">
                            <div className="h-full border border-gray-200 border-opacity-60 rounded-lg p-4">
                                <h2 className="text-sm font-medium text-gray-900">
                                    {comment.name } {/* Display the name of the commenter */}
                                </h2>
                                <p className="text-gray-800 mt-2 mb-4">
                                    {comment.content}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Posted on {new Date(comment.createdAt).toLocaleDateString()}
                                </p>
                                <div className='mt-4 flex gap-2'>
                                    <Button onClick={() => handleLike(comment._id)}>Like</Button>
                                    <Button onClick={() => handleEdit(comment._id)}>Edit</Button>
                                    <Button onClick={() => {
                                        setShowModal(true);
                                        setCommentToDelete(comment._id);
                                    }}>Delete</Button>
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
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this comment?
                        </h3>
                        <div className='flex justify-center gap-4'>
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
