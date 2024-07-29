"use client";
import React, { useState } from 'react'
import { useFormik } from 'formik'
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Signup = () => {

    const router=useRouter();
    const signupvalidationSchema = Yup.object().shape({
        name: Yup.string().required(' Name is required'),
        phoneNumber: Yup.string().required('Phone number is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
        cpassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required')
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            phoneNumber: '',
            email: '',
            password: '',
            cpassword: '',
            avatar: ''
        },

        onSubmit: (values) => {
            values.avatar = selImage.name;
            console.log(values);
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/User/add`, {
                method: 'POST',
                body: JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    console.log(response.status);
                    if (response.status === 200) {
                        toast.success('User Registered successfully');
                        formik.resetForm();
                        router.push("/login")
                    } else {
                        toast.error('Some Error Occured');
                    }

                }).catch((err) => {
                    console.log(err);
                    toast.error('Some Error Occured');
                })
        },

        validationSchema: signupvalidationSchema,

    });

    const [selImage, setselImage] = useState('');

    const uploadeImage = async (e) => {
        const file = e.target.files[0];
        setselImage(file);
        const fd = new FormData();
        fd.append("myfile", file);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/util/uploadfile`, {
            method: "POST",
            body: fd,
        }).then((res) => {
            if (res.status === 200) {
                console.log("file uploaded");
                toast.success('File Uploaded!!');
            }
        });
    }


    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-mate_black ">
            <div className=" sm:mx-auto sm:w-full sm:max-w-2xl rounded-lg">
                <div className=" mt-5 sm:mx-auto sm:w-full sm:max-w-2xl">
                    <img
                        className="mx-auto h-20 w-auto  rounded-full"
                        src="/logo.png"
                        alt="OwnYOURCAP "
                    />
                    <h2 className="mt-3 text-center text-3xl leading-9 tracking-wide text-quaternary font-Montserrat font-extrabold ">
                        Create a free account
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl font-Syne">
                    <form onSubmit={formik.handleSubmit} className="space-y-3">

                        <div>
                            <label htmlFor="name" className="block text-md font-bold leading-6 text-quaternary">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    autoComplete="off"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder=' Enter your full name'
                                    className="block w-full rounded-md border-0  px-3.5 py-2 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
                                />
                                {formik.touched.name && formik.errors.name ? (
                                    <div className="text-red-600 text-sm ">{formik.errors.name}</div>
                                ) : null}
                            </div>
                        </div>

                        <div className="sm:col-span-2 ">
                            <label htmlFor="phoneNumber" className="block text-md font-bold leading-6 text-quaternary">
                                Phone Number
                            </label>
                            <div className="mt-1 ">
                                <input
                                    type="number"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    autoComplete="off"
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder=' Enter your phone number'
                                    className="block w-full font-Josefin_Sans  rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
                                />
                                {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                                    <div className="text-red-600 text-sm ">{formik.errors.phoneNumber}</div>
                                ) : null}
                            </div>
                        </div>


                        <div className="sm:col-span-2 ">
                            <label htmlFor="email" className="block text-md font-bold leading-6 text-quaternary">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder='  Enter your email address'
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div className="text-red-600 text-sm ">{formik.errors.email}</div>
                                ) : null}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-md font-bold leading-6 text-quaternary">
                                    Password
                                </label>

                            </div>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder=' Create a password'
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="block w-full rounded-md border-0  py-2 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="text-red-600 text-sm ">{formik.errors.password}</div>
                                ) : null}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-md font-bold leading-6 text-quaternary">
                                    Confirm Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    name="cpassword"
                                    type="password"
                                    id="cpassword"
                                    autoComplete="current-password"
                                    placeholder=' Confirm password'
                                    value={formik.values.cpassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
                                />
                                {formik.touched.cpassword && formik.errors.cpassword ? (
                                    <div className="text-red-600 text-sm">{formik.errors.cpassword}</div>
                                ) : null}
                            </div>
                        </div>

                        <div className="mt-10 " >
                            <label
                                htmlFor="avatar"
                                className="block fz-14 text-md font-bold  leading-6 text-quaternary cursor-pointer"
                            >
                                Choose Profile photo
                            </label>
                            <div className="mt-1 ">
                                <input
                                    onChange={uploadeImage}
                                    id="avatar"
                                    name="avatar"
                                    type="file"
                                    required=""
                                    className="block w-full rounded-md border-0 py-0 text-quaternary shadow-sm ring-2 ring-inset ring-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"

                                />

                            </div>

                        </div>

                        <div>
                            <button type="submit"
                                className="flex w-full justify-center rounded-md bg-gray-900   hover:bg-quaternary px-3 py-1.5 text-sm font-semibold leading-6 text-white outline hover:text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                            >
                                Create Account
                            </button>
                        </div>
                        
                    </form>

                    <p className="mt-10 mb-5 text-center text-md text-gray-500">
                        Already have an account?{' '}
                        <Link href='/Login' className="font-semibold text-lg leading-6 text-quaternary/80 hover:text-black">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup