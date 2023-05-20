import React, { useEffect } from "react";
import emptyProfile from "../Assets/Images/no_profile_picture.jpeg";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineDashboard, AiOutlineIdcard } from "react-icons/ai";
import "../Css/SAdminDashboard.css";
import { NavLink, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createContext } from "react";
import { db } from "../Firebase/config";
import Avatar from "@mui/material/Avatar";
import firebase from "firebase/compat/app";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { GiBookCover } from "react-icons/gi";
import { BiReceipt } from "react-icons/bi";
import organization_Logo from "../Assets/Logos/organization_Logo.png";
import Footer from "../Components/Footer";

// Exporting the context (Search,User)
export const studentUser = createContext("");

const StudentDashboard = () => {
  const { state } = useLocation();
  const [user, setUser] = useState(state ? state.user : "");
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    // Get the currently signed-in user
    const getUser = async () => {
      try {
        const user = firebase.auth().currentUser;

        if (!user) {
          firebase.auth().signOut();
          navigate("/student/login");
        }
      } catch (error) {
        console.log(error);
      }

      // Getting the user id from local storage
      const userFirebaseId = localStorage.getItem("studentUser");
      if (userFirebaseId) {
        db.collection("students")
          .doc(userFirebaseId)
          .onSnapshot((snapshot) => {
            setUser({ ...snapshot.data(), firebaseId: snapshot.id });
          });
      }
    };

    // After 10 minutes it will be automatically logged out
    const interval = setInterval(() => {
      firebase.auth().signOut();
      getUser();
    }, 15 * 60 * 1000); //Converting 10mins to milliseconds

    // Running it once within 1s
    setTimeout(() => {
      getUser();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Checks whether the object is empty or not
  const isObjectEmpty = (objectName) => {
    return JSON.stringify(objectName) === "{}";
  };

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then((res) => {
        navigate("/");
      });
  };
  return (
    // Dashboard
    <div className="student-dashboard ">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-dark">
        <div className="container-fluid">
          <ul className="navbar-nav ">
            <li class="nav-item dropdown px-lg-5 px-sm-2 ms-1">
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <Avatar
                  alt="User"
                  src={
                    user && user.studentphoto
                      ? user.studentphoto.URL
                      : emptyProfile
                  }
                  sx={{ width: 56, height: 56 }}
                />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleClose}>
                  {user ? user.firstname + " " + user.lastname : ""}
                </MenuItem>
                <MenuItem onClick={handleClose} className="text-uppercase">
                  Student
                </MenuItem>
                <MenuItem onClick={handleClose} className="text-uppercase">
                  {user && user.sid !== undefined ? user.sid : ""}
                </MenuItem>
                <NavLink to="editprofile" className="text-decoration-none">
                  <MenuItem onClick={handleClose} className="border rounded ">
                    Edit Profile
                  </MenuItem>
                </NavLink>
              </Menu>

              {!isObjectEmpty(user) ? <></> : ""}
            </li>
          </ul>

          <button
            className="navbar-toggler "
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon "></span>
          </button>
          <div
            className="  collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
            {/* Organization Logo */}
            <div className="d-flex justify-content-lg-center justify-content-md-center justify-content-sm-center w-100">
              {" "}
              <img src={organization_Logo} alt="" width={150} />
            </div>
            
            {/* log out */}
            <form className=" d-lg-flex ms-1">
              <abbr title="Log Out" className="text-decoration-none">
                <NavLink to="/teacher/login" className="text-decoration-none">
                  <button
                    className="btn-logout btn btn-outline-success text-white mx-3 ms-auto w-100"
                    type="submit"
                    onClick={() => {
                      signOut();
                    }}
                  >
                    {<FiLogOut />}
                  </button>
                </NavLink>
              </abbr>
            </form>
          </div>
        </div>
      </nav>

      {/* sidebar */}
      <div className="admin-sidebar position-absolute bg-dark ">
        {/* SideBar Main Menu */}
        <section className="w-100">
          <div className="heading text-white pt-3 ps-2">Main Menu</div>
          <div className="options pt-2 ">
            <NavLink
              className="text-decoration-none text-white"
              to={
                location.pathname !== "/student/dashboard/"
                  ? `/student/dashboard`
                  : ""
              }
            >
              <abbr title="Dashboard" className="text-decoration-none">
                <div className="option option-1 d-flex w-100 ps-3 py-3">
                  <div className="icon pe-2 ">
                    <AiOutlineDashboard color="white" size={25} />
                  </div>
                  <div className="text text-white">Dashboard</div>
                </div>
              </abbr>
            </NavLink>

            <NavLink
              className="text-decoration-none text-white"
              to="attendance"
            >
              <abbr title="Attendance" className="text-decoration-none">
                <div className="option option-1 d-flex w-100 ps-3 py-3">
                  <div className="icon pe-2">
                    <AiOutlineIdcard color="white" size={25} />
                  </div>
                  <div className="text text-white">Attendance</div>
                </div>
              </abbr>
            </NavLink>

            <NavLink className="text-decoration-none text-white" to="courses">
              <abbr title="Account" className="text-decoration-none">
                <div className="option option-1 d-flex w-100 ps-3 py-3">
                  <div className="icon pe-2">
                    {" "}
                    <GiBookCover color="white" size={25} />
                  </div>
                  <div className="text text-white">Class</div>
                </div>
              </abbr>
            </NavLink>

            <NavLink
              className="text-decoration-none text-white"
              to="showalltrans"
            >
              <abbr title="Transactions" className="text-decoration-none ">
                <div className="option option-1 d-flex w-100 ps-3 py-3">
                  <div className="icon pe-1">
                    <BiReceipt color="white" size={25} />
                  </div>
                  <div className="text text-white">Transactions</div>
                </div>
              </abbr>
            </NavLink>
          </div>
        </section>
      </div>

      {/* footer */}
      <Footer />

      {/* main content */}
      <section className="main-content text-secondary ">
        {/* <AdminRouting/> */}
        <studentUser.Provider value={user}>
          <Outlet />
        </studentUser.Provider>
      </section>
    </div>
  );
};

export default StudentDashboard;
