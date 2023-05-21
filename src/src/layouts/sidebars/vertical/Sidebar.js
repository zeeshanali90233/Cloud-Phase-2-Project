import { Button, Nav, NavItem } from "reactstrap";
import Logo from "../../logo/Logo";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { user_Detail_Context } from "../../../../context/userContext";
import { db } from "../../../Firebase/config";
import { useState } from "react";

const Sidebar = ({
  showMobilemenu,
  isSAdmin,
  isAdmin,
  isStaff,
  isTeacher,
  isStudent,
}) => {
  let curl = useRouter();
  const location = curl.pathname;
  const router = useRouter();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const { user, setUser } = useContext(user_Detail_Context);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    const fetchUser = async () => {
      if (isSAdmin) {
        // Getting the id from local storage
        const userId = localStorage.getItem("sAdminUser");
        // Fetching the record from firebase
        const snapshot = await db.collection("superadmin").doc(userId).get();
        setUser({ ...snapshot.data(), firebaseId: snapshot.id });
      } else if (isAdmin) {
        // Getting the id from local storage
        const userId = localStorage.getItem("adminUser");
        // Fetching the record from firebase
        const snapshot = await db.collection("admin").doc(userId).get();
        setUser({ ...snapshot.data(), firebaseId: snapshot.id });
      } else if (isStaff) {
        // Getting the id from local storage
        const userId = localStorage.getItem("staffUser");
        // Fetching the record from firebase
        const snapshot = await db.collection("staff").doc(userId).get();
        setUser({ ...snapshot.data(), firebaseId: snapshot.id });
      } else if (isTeacher) {
        // Getting the id from local storage
        const userId = localStorage.getItem("teacherUser");
        // Fetching the record from firebase
        const snapshot = await db.collection("teacher").doc(userId).get();
        setUser({ ...snapshot.data(), firebaseId: snapshot.id });
      } else if (isStudent) {
        // Getting the id from local storage
        const userId = localStorage.getItem("studentUser");
        // Fetching the record from firebase
        const snapshot = await db.collection("students").doc(userId).get();
        setUser({ ...snapshot.data(), firebaseId: snapshot.id });
      }
    };

    fetchUser();
  }, [router.query]);
  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Logo />
        <Button
          close
          size="sm"
          className="ms-auto d-lg-none"
          onClick={showMobilemenu}
        ></Button>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="sidebarNav">
          <NavItem className="sidenav-bg">
            <Link
              href={`/${router.pathname.split("/")[1]}/${
                router.pathname.split("/")[2]
              }`}
            >
              <a
                className={
                  location === "/"
                    ? "text-primary nav-link py-3"
                    : "nav-link text-secondary py-3"
                }
              >
                <i className="bi bi-speedometer2"></i>
                <span className="ms-3 d-inline-block">Dashboard</span>
              </a>
            </Link>
          </NavItem>

          {(isSAdmin || isAdmin) && (
            <NavItem className="sidenav-bg">
              <Link
                href={`/${router.pathname.split("/")[1]}/${
                  router.pathname.split("/")[2]
                }/attendance`}
              >
                <a
                  className={
                    location === "/attendance"
                      ? "text-primary nav-link py-3"
                      : "nav-link text-secondary py-3"
                  }
                >
                  <i className="bi bi-card-checklist"></i>
                  <span className="ms-3 d-inline-block">Attendance</span>
                </a>
              </Link>
            </NavItem>
          )}

          {(isStaff
            ? user && user.studentauthority && user.studentauthority.add
            : isStudent
            ? false
            : true) && (
            <NavItem className="sidenav-bg">
              <a
                className="nav-link text-secondary py-3 flex items-center cursor-pointer"
                onClick={toggleDropdown}
              >
                <i className="bi bi-patch-check"></i>
                <span className="ms-3 d-inline-block">Admission</span>
                <svg
                  className="w-4 h-4 ml-2"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              {isDropdownOpen && (
                <div
                  id="dropdownBottom"
                  className="z-10 rounded-lg shadow w-full dark:bg-gray-700"
                >
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownBottomButton"
                  >
                    <Link
                      href={`/${router.pathname.split("/")[1]}/${
                        router.pathname.split("/")[2]
                      }/admission/addstudent`}
                    >
                      <li className="cursor-pointer">
                        <a
                          className={`block px-4 py-2 ${
                            location.includes("/admission/addstudent") &&
                            "text-primary nav-link"
                          } hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}
                        >
                          Add Student
                        </a>
                      </li>
                    </Link>

                    <Link
                      href={`/${router.pathname.split("/")[1]}/${
                        router.pathname.split("/")[2]
                      }/admission/addteacher`}
                    >
                      <li className="cursor-pointer">
                        <a
                          className={`block px-4 py-2 ${
                            location.includes("/admission/addteacher") &&
                            "text-primary nav-link"
                          } hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}
                        >
                          Add Teacher/Instructor
                        </a>
                      </li>
                    </Link>

                    <Link
                      href={`/${router.pathname.split("/")[1]}/${
                        router.pathname.split("/")[2]
                      }/admission/addstaff`}
                    >
                      <li className="cursor-pointer">
                        <a
                          className={`block px-4 py-2 ${
                            location.includes("/admission/addstaff") &&
                            "text-primary nav-link"
                          } hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`}
                        >
                          Add Staff
                        </a>
                      </li>
                    </Link>
                  </ul>
                </div>
              )}
            </NavItem>
          )}

          {(isStaff
            ? user && user.studentauthority && user.studentauthority.review
            : isStudent
            ? false
            : true) && (
            <NavItem className="sidenav-bg">
              <Link
                href={`/${router.pathname.split("/")[1]}/${
                  router.pathname.split("/")[2]
                }/message`}
              >
                <a
                  className={
                    location === "/message"
                      ? "text-primary nav-link py-3"
                      : "nav-link text-secondary py-3"
                  }
                >
                  <i className="bi bi-hdd-stack"></i>
                  <span className="ms-3 d-inline-block">Message</span>
                </a>
              </Link>
            </NavItem>
          )}

          {(isSAdmin || isAdmin) && (
            <NavItem className="sidenav-bg">
              <Link
                href={`/${router.pathname.split("/")[1]}/${
                  router.pathname.split("/")[2]
                }/staff`}
              >
                <a
                  className={
                    location === "/staff"
                      ? "text-primary nav-link py-3"
                      : "nav-link text-secondary py-3"
                  }
                >
                  <i className="bi bi-people"></i>
                  <span className="ms-3 d-inline-block">Staff</span>
                </a>
              </Link>
            </NavItem>
          )}

          {(isSAdmin || isAdmin
            ? true
            : isStaff
            ? user && user.studentauthority && user.studentauthority.review
            : isTeacher || isStudent
            ? false
            : false) && (
            <NavItem className="sidenav-bg">
              <Link
                href={`/${router.pathname.split("/")[1]}/${
                  router.pathname.split("/")[2]
                }/student`}
              >
                <a
                  className={
                    location === "/student"
                      ? "text-primary nav-link py-3"
                      : "nav-link text-secondary py-3"
                  }
                >
                  <i className="bi bi-people"></i>
                  <span className="ms-3 d-inline-block">Student</span>
                </a>
              </Link>
            </NavItem>
          )}

          {(isStaff
            ? user && user.courseauthority && user.courseauthority.review
            : true) && (
            <NavItem className="sidenav-bg">
              <Link
                href={`/${router.pathname.split("/")[1]}/${
                  router.pathname.split("/")[2]
                }/courses`}
              >
                <a
                  className={
                    location === "/courses"
                      ? "text-primary nav-link py-3"
                      : "nav-link text-secondary py-3"
                  }
                >
                  <i className="bi bi-layout-split"></i>
                  <span className="ms-3 d-inline-block">Courses</span>
                </a>
              </Link>
            </NavItem>
          )}

          {(isSAdmin
            ? true
            : isAdmin
            ? user && user.canmanagesalary
            : isStaff || isStudent || isTeacher
            ? false
            : false) && (
            <NavItem className="sidenav-bg">
              <Link
                href={`/${router.pathname.split("/")[1]}/${
                  router.pathname.split("/")[2]
                }/dues`}
              >
                <a
                  className={
                    location === "/dues"
                      ? "text-primary nav-link py-3"
                      : "nav-link text-secondary py-3"
                  }
                >
                  <i className="bi bi-wallet"></i>
                  <span className="ms-3 d-inline-block">Dues</span>
                </a>
              </Link>
            </NavItem>
          )}

          {(isStaff
            ? user && user.feesauthority && user.feesauthority.review
            : true) && (
            <NavItem className="sidenav-bg">
              <Link
                href={`/${router.pathname.split("/")[1]}/${
                  router.pathname.split("/")[2]
                }/fees`}
              >
                <a
                  className={
                    location === "/fees"
                      ? "text-primary nav-link py-3"
                      : "nav-link text-secondary py-3"
                  }
                >
                  <i className="bi bi-wallet"></i>
                  <span className="ms-3 d-inline-block">Fees</span>
                </a>
              </Link>
            </NavItem>
          )}

          <NavItem className="sidenav-bg">
            <Link
              href={`/${router.pathname.split("/")[1]}/${
                router.pathname.split("/")[2]
              }/transactions`}
            >
              <a
                className={
                  location === "/transactions"
                    ? "text-primary nav-link py-3"
                    : "nav-link text-secondary py-3"
                }
              >
                <i className="bi bi-receipt"></i>
                <span className="ms-3 d-inline-block">Transactions</span>
              </a>
            </Link>
          </NavItem>

          <Button
            color="secondary"
            tag="a"
            target="_blank"
            className="mt-3"
            href="https://www.wrappixel.com/templates/xtreme-next-js-free-admin-template/"
          >
            Download Free
          </Button>
          <Button
            color="danger"
            tag="a"
            target="_blank"
            className="mt-3"
            href="https://www.wrappixel.com/templates/xtreme-react-redux-admin/?ref=33"
          >
            Upgrade To Pro
          </Button>
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
