import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import { db } from "../../src/Firebase/config";
import firebase from "firebase/compat/app";
import { useContext } from "react";
import { user_Detail_Context } from "../../context/userContext";
import Head from "next/head";

const Login = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const router = useRouter();
  const { setUser } = useContext(user_Detail_Context);

  const handleChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    setShowErrorToast(false);
    setShowSuccessToast(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setShowErrorToast(false);
    setShowSuccessToast(false);
    setIsWaiting(true);
    // Taking id as the email here from the login form
    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(loginForm.email, loginForm.password)
        .then((res) => {
          // Fetching the user firebase id and storing at the local storage then navigating to dashboard
          db.collection("superadmin")
            .where("email", "==", loginForm.email)
            .get()
            .then((res) => {
              localStorage.setItem("sAdminUser", res.docs[0].id);
              setUser({...res.docs[0].data(),firebaseId:res.docs[0].id});

              // Also passing the user data as props
              router.push("/sadmin/dashboard");

              setIsWaiting(false);
              setShowSuccessToast(true);
            });
        })
        .catch((err) => {
          setShowErrorToast(true);
          setIsWaiting(false);
        });
    } catch (err) {
      setShowErrorToast(true);
      setIsWaiting(false);
    }
  };

  return (
    <section
      className="bg-gray-50 dark:bg-gray-900 "
    >
      <Head>
        <title>
          Super Admin Login | Learning Management System - Teps PVT Ltd
        </title>
        <meta
          name="description"
          content="Log in to the Teps PVT Ltd Learning Management System (LMS) as a Super Admin to manage user accounts, courses, and settings."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link
          rel="canonical"
          href={`https://${process.env.NEXT_PUBLIC_DOMAINNAME}/sadmin/login`}
        />

        <meta
          property="og:title"
          content="Super Admin Login | Learning Management System - Teps PVT Ltd"
        />
        <meta
          property="og:description"
          content="Log in to the Teps PVT Ltd Learning Management System (LMS) as a Super Admin to manage user accounts, courses, and settings."
        />
        <meta
          property="og:url"
          content={`https://${process.env.NEXT_PUBLIC_DOMAINNAME}/sadmin/login`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/favicon-16x16.png" />

        <meta
          name="twitter:title"
          content="Super Admin Login | Learning Management System - Teps PVT Ltd"
        />
        <meta
          name="twitter:description"
          content="Log in to the Teps PVT Ltd Learning Management System (LMS) as a Super Admin to manage user accounts, courses, and settings."
        />
        <meta name="twitter:image" content="/favicon-16x16.png" />

        <link rel="icon" href="/favicon-16x16.png" />
      </Head>

      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <Image
            className="w-8 h-8 mr-2 rounded "
            src="/p2plogo.png"
            alt="logo"
            width={50}
            height={50}
          />
          <span className="ml-1">Super Admin</span>
        </a>
        <div className="w-full bg-white  rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="h-12">
            {showErrorToast && (
              <div
                className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert"
              >
                <span className="font-medium">
                  Incorrect Credentials or Internet Error
                </span>
              </div>
            )}

            {showSuccessToast && (
              <div
                className="p-4  text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                role="alert"
              >
                <span className="font-medium">Successfully Login!</span>
              </div>
            )}
          </div>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                  <Link href="forgotpassword">Forgot password?</Link>
                </span>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {!isWaiting && "Sign in"}
                {isWaiting && "Please Wait..."}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
