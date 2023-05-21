import Head from "next/head";
import "../styles/style.scss";
import "../styles/global.css";
import LoadingBar from "react-top-loading-bar";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import UserContext from "../context/userContext";
import Script from "next/script";


function MyApp({ Component, pageProps }) {
  const [progress, setProgress] = useState(100);
  const router = useRouter();


  useEffect(() => {
    const handleRouteChangeSt = () => {
      setTimeout(() => {
        setProgress(75);
      }, 100);
    };

    const handleRouteChangeCp = () => {
      setTimeout(() => {
        setProgress(100);
      }, 100);
    };

    router.events.on("routeChangeStart", handleRouteChangeSt);
    router.events.on("routeChangeComplete", handleRouteChangeCp);

   
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeSt);
      router.events.off("routeChangeComplete", handleRouteChangeCp);
    };
  }, [router]);

  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Teps PVT Ltd's LMS application, developed by P2P Cloud, provides comprehensive online learning solutions for students of all ages."
        />
        <meta
          name="keywords"
          content="LMS, online learning, P2P Cloud,Teps PVT Ltd"
        />
        <meta name="author" content="Teps PVT Ltd" />
        <meta name="theme-color" content="#000000" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css" rel="stylesheet" />
        <title>Learning Management System</title>
      </Head>
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />

      <UserContext>
      <Component {...pageProps} />
      </UserContext>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.js"></Script>
    </>
  );
}

export default MyApp;
