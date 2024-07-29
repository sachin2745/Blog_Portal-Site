"use client";
import React, { useState, useRef } from 'react';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from 'flowbite-react';
import useAppContext from '@/context/AppContext';

const UploadBlog = () => {
    const productSchema = Yup.object().shape({
        title: Yup.string().required('Title is Required').min(5, 'Title is Too Short'),
        category: Yup.string().required('Category is Required'),
        content: Yup.string().required('Content is Required').min(50, 'Content is Too Short'),
    });

    const [selImage, setSelImage] = useState('');
    const { currentUser } = useAppContext();
    const quillRef = useRef(null);

    const uploadImage = async (e) => {
        const file = e.target.files[0];
        setSelImage(file);
        const fd = new FormData();
        fd.append("myfile", file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/util/uploadfile`, {
                method: "POST",
                body: fd,
            });

            if (res.status === 200) {
                toast.success('File Uploaded!!');
            }
        } catch (error) {
            toast.error('Failed to upload file');
        }
    };

    const postForm = useFormik({
        initialValues: {
            title: '',
            category: '',
            image: '',
            content: '',
            postedAt: new Date(),
        },
        onSubmit: async (values) => {
            values.image = selImage.name;

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/add`, {
                    method: "POST",
                    body: JSON.stringify(values),
                    headers: {
                        "Content-Type": "application/json",
                        'x-auth-token': currentUser !== null ? currentUser.token : '',
                    },
                });

                if (res.status === 200) {
                    toast.success("Uploaded Successfully");
                    postForm.resetForm();
                } else {
                    toast.error("Something went wrong");
                }
            } catch (error) {
                toast.error("Something went wrong");
            }
        },
        validationSchema: productSchema,
    });

    return (
        <>
            <div className='p-3 max-w-3xl mx-auto min-h-screen'>
                <h1 className='text-center text-4xl my-7 font-extrabold font-Josefin_Sans'>Create a Blog</h1>
                <form className='flex flex-col gap-4 font-Montserrat' onSubmit={postForm.handleSubmit}>
                    <div>
                        <input
                            type='text'
                            placeholder='Title'
                            id='title'
                            value={postForm.values.title}
                            onChange={postForm.handleChange}
                            className="outline outline-1 block w-full rounded-md border-0 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary/80 sm:text-sm sm:leading-6"
                        />
                        {postForm.touched.title && <span className="text-red-500 font-Jost">{postForm.errors.title}</span>}
                    </div>
                    <div className="mt-3">
                        <select
                            id="category"
                            value={postForm.values.category}
                            onChange={postForm.handleChange}
                            name="category"
                            className="outline outline-1 block w-full rounded-md border-0 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary/80 sm:text-sm sm:leading-6"
                        >
                            <option value=''>Select a category</option>
                            <option value='javascript'>JavaScript</option>
                            <option value='reactjs'>React.js</option>
                            <option value='nextjs'>Next.js</option>
                        </select>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className="relative w-full min-w-[200px]">
                            <input
                                onChange={uploadImage}
                                id="image"
                                name="image"
                                type="file"
                                className="outline outline-1 block w-full rounded-md border-0 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary/80 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <ReactQuill
                        ref={quillRef}
                        theme='snow'
                        id='content'
                        placeholder='Write something...'
                        className='h-72 mb-12'
                        value={postForm.values.content}
                        onChange={(value) => postForm.setFieldValue('content', value)}
                    />
                    <Button type='submit' gradientDuoTone='greenToBlue'>
                        Publish
                    </Button>
                </form>
            </div>
        </>
    );
}

export default UploadBlog;