import Head from "next/head";
import HomePage from "../src/components/HomePage";

export default function Home() {

  return (
    <div>
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

        <title>Learning Management System</title>
        
      </Head>

      

      <div>
        <HomePage />
      </div>


    </div>
  );
}
