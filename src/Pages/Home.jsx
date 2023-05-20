import React from "react";
import "../Css/Home.css";
import { NavLink } from "react-router-dom";
// importing the logos
import orgLogo from "../Assets/Logos/organization_Logo.png";
import playstore from "../Assets/Logos/playstore_Logo.png";
import youtube from "../Assets/Logos/youtube_Logo.jpg";
import contactUs from "../Assets/Logos/contactus_Logo.png";
import {organizationDetails,P2PClouds} from "../Organization/details";

const Home = () => {
  return (
    <div className="home-container">
      {/* header */}
      <div className="header text-center py-5 bg-dark">
        <img src={orgLogo} alt="#" width={260} />
        <h1 className="title pt-2 text-white">
          {/* {organization.organizationDetails.name} */}
        </h1>
        <div className="sub-title text-white">E-Learning System</div>
      </div>

      {/* Home Page Login Panel(Like Admin Login , Student Login)  */}
      <div className="login-panel container mt-3">
        <div className="row pb-1">
          <NavLink
            to="/sadmin/login"
            className="text-decoration-none panel super-admin text-center py-2 rounded col-6 border"
          >
            <div>
              <h2>Super Admin Login</h2>
            </div>
          </NavLink>
          <NavLink
            to="/admin/login"
            className="text-decoration-none panel admin text-center  py-2 rounded col-6 ml-5 border"
          >
            <div>
              <h2>Admin Login</h2>
            </div>
          </NavLink>
        </div>
        <div className="row pb-1">
          <NavLink
            to="/teacher/login"
            className="text-decoration-none panel teacher text-center  py-2 rounded col-6 border"
          >
            <div>
              <h2>Teacher Login</h2>
            </div>
          </NavLink>

          <NavLink
            to="/staff/login"
            className="text-decoration-none panel staff text-center  py-2 rounded col-6 border"
          >
            <div>
              <h2>Staff Login</h2>
            </div>
          </NavLink>
        </div>

        <NavLink
          to="student/login"
          className="text-decoration-none panel student text-center  py-2 rounded row col-13 border"
        >
          <div>
            <h2>Student Login</h2>
          </div>
        </NavLink>
      </div>

      {/* footer */}
      <div className="footer text-center pb-0 mb-0 mt-5">
        <div className="d-lg-flex d-md-flex justify-content-center">
          <a href={organizationDetails.mobileAppUrl}>
            <div className="playstore-app">
              <img src={playstore} alt="#" width={150} />
            </div>
          </a>

         <a href={organizationDetails.youtubeUrl}> <div className="youtube">
            <img src={youtube} alt="#" width={150} />
          </div></a>

          {/* Contact Us Page */}
          <div className="contact-us">
            <img src={contactUs} alt="#" width={150} />
          </div>
        </div>
        {/* footer text */}
        <div className="text">
          <p>
            &copy; Copyright {new Date().getFullYear()} &nbsp;
            <a href={organizationDetails.website} >
              Teps PVT(LTD)
            </a>{" "}
            Design and Developed by{" "}
            <a href={P2PClouds.website} >P2P CLOUDS</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
