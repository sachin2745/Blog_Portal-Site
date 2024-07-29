"use client";
import React, { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useAppContext from '@/context/AppContext';
import Link from 'next/link';

const Login = () => {

  const loginwithgoogle = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback`, "_self")
  }

  const router = useRouter();
  const { setLoggedIn, setCurrentUser } = useAppContext();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },

    onSubmit: (values) => {
      console.log(values);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/User/authenticate`, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          console.log(response.status);
          if (response.status === 200) {
            toast.success('User login successfully');
            response.json().then(data => {
              sessionStorage.setItem('user', JSON.stringify(data));
              setCurrentUser(data);
              setLoggedIn(true);
              formik.resetForm();
              router.push("/")
            })
          } else {
            toast.error('Some Error Occured');
          }

        }).catch((err) => {
          console.log(err);
          toast.error('Some Error Occured');
        })

    },


  });

  const [showPassword, setShowPassword] = useState(false);

  const handleCheckboxChange = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>

      <div className="flex  flex-1 flex-col justify-center px-6  py-24   lg:px-8 bg-white">
        <div className=' sm:mx-auto sm:w-full sm:max-w-3xl  rounded-lg '>
          <div className="group">
            <div className="mt-3">
              <img
                className="mx-auto h-20 w-auto rounded-full "
                src="/logo.png"
                alt="Blog_Portal"
              />
              <h2 className="mt-2 text-center text-3xl  leading-9 tracking-wide text-quaternary font-Montserrat font-extrabold ">
                Login To Your Account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl font-Syne ">
              <form className="space-y-6" action="#" method="POST" onSubmit={formik.handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-md font-medium leading-6 text-quaternary">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder='Enter your email address'
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-800 placeholder:text-gray-400 focus:ring-2  focus:ring-inset focus:ring-quaternary sm:text-sm sm:leading-6"
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-red-500 text-xs">{formik.errors.email}</div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-md font-medium leading-6 text-quaternary">
                      Password
                    </label>
                    <div className="text-sm">
                      <a href="/resetPassword" className="font-semibold text-spaceblack/70 hover:text-black">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div className="relative">
                    <input id="password"
                      name="password"
                      placeholder='Enter your Password'
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      type={showPassword ? 'text' : 'password'}

                      className="block w-full mb-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-quaternary sm:text-sm sm:leading-6"
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <div className="text-red-500 text-xs">{formik.errors.password}</div>
                    ) : null}

                    <label className=' text-sm text-spaceblack/70 hover:text-black font-medium'>
                      <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={handleCheckboxChange}
                        className='mr-2  text-spaceblack  '
                      />
                      Show Password
                    </label>
                  </div>

                </div>

              
                  <button
                    type="submit"
                    className="flex w-full outline font-Jost justify-center rounded-md hover:bg-quaternary px-3 py-1.5 text-sm font-semibold leading-6 text-quaternary hover:text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Log in
                  </button>

               

                <button type="button" onClick={loginwithgoogle} className="text-white w-full justify-center text-center bg-[#24292F] hover:bg-[#24292F]/80 focus:ring-2 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5  py-2.5  inline-flex items-center  dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2">
                  <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 1792 1792">
                    <path
                      className="color000000 svgShape"
                      d="M896 786h725q12 67 12 128 0 217-91 387.5T1282.5 1568 896 1664q-157 0-299-60.5T352 1440t-163.5-245T128 896t60.5-299T352 352t245-163.5T896 128q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65T484 652.5 420 896t64 243.5T657.5 1316t238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78H896V786z"
                      fill="#fff"
                    />
                  </svg>
                  Sign in with Google
                </button>
              </form>

              <p className="mt-10 mb-5 text-center text-sm text-gray-700">
                Not a member?{' '}
                <Link href="/Signup" className="font-semibold font-Jost leading-6 text-spaceblack/90 hover:text-black">
                  Register for an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login