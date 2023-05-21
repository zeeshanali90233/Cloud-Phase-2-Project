import React from "react";
import Link from "next/link";
import Image from "next/image";

// importing the logos
import { organizationDetails, P2PClouds } from "../Organization/details";

const Home = () => {
  return (
    <div className="home-container min-h-screen" >
      {/* header */}
      <div className="header text-center py-5 bg-dark mx-auto">
        <Image
          src={"/organization_Logo.png"}
          alt="#"
          width={260}
          height={100}
        />
        <h1 className="title pt-2 text-white">
          {/* {organization.organizationDetails.name} */}
        </h1>
        <div className="sub-title text-white">E-Learning System</div>
      </div>

      {/* Home Page Login Panel(Like Admin Login , Student Login)  */}
      <div className="login-panel  w-full mx-auto flex flex-wrap justify-center mt-1 gap-3 container">
        {/* ->Super Admin  */}
        <Link href="sadmin/login">
          <div className="superadmin w-[300px] text-center py-3   bg-blue-500 rounded text-white lg:mr-3 cursor-pointer select-none">
            Super Admin Login
          </div>
        </Link>

        {/* -> Admin  */}
        <Link href="admin/login">
          <div className="admin bg-orange-400 w-[300px] text-center py-3 rounded text-white lg:mr-3 select-none cursor-pointer">
            Admin Login
          </div>
        </Link>

        {/* ->Teacher  */}
        <Link href="teacher/login">
          <div className="teacher bg-purple-600 w-[300px] text-center py-3 rounded text-white select-none cursor-pointer">
            Teacher Login
          </div>
        </Link>

        {/* ->Staff  */}
        <Link href="staff/login">
          <div className="staff bg-purple-600 w-[300px] text-center py-3 rounded text-white select-none cursor-pointer">
            Staff Login
          </div>
        </Link>

        {/* ->Student*/}
        <Link href="student/login">
          <div className="student bg-purple-600 w-[300px] text-center  py-3 rounded text-white select-none cursor-pointer">
            Student Login
          </div>
        </Link>
      </div>

      {/* footer */}
      <div className="footer text-center pb-0 mb-0 mt-14 h-full">
        <div className="d-lg-flex d-flex justify-content-center flex-wrap">
          <a href={organizationDetails.mobileAppUrl}>
            <div className="playstore-app">
              <img src={"/playstore_Logo.png"} alt="#" width={150} />
            </div>
          </a>

          <a href={organizationDetails.youtubeUrl}>
            {" "}
            <div className="youtube">
              <img src={"/youtube_Logo.jpg"} alt="#" width={150} />
            </div>
          </a>

          {/* Contact Us Page */}
          <div className="contact-us">
            <img src={"/contactus_Logo.png"} alt="#" width={150} />
          </div>
        </div>
        {/* footer text */}
        <div className="text mt-auto">
          <p>
            &copy; Copyright {new Date().getFullYear()} &nbsp;
            <a href={organizationDetails.website} className="text-blue-600">
              Teps PVT(LTD)
            </a>{" "}
            Design and Developed by{" "}
            <a href={P2PClouds.website} className="text-blue-600">
              P2P CLOUDS
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
