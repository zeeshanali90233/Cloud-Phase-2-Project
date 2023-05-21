import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Navbar,
  Nav,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import LogoWhite from "../../assets/images/logos/xtremelogowhite.svg";
import EmptyProfile from "../../assets/images/no_profile_picture.jpeg";
import { useRouter } from "next/router";
import { db } from "../../Firebase/config";
import { user_Detail_Context } from "../../../context/userContext";
import { useContext } from "react";
import firebase from "firebase/compat/app";

const Header = ({
  showMobmenu,
  isSAdmin,
  isAdmin,
  isStaff,
  isTeacher,
  isStudent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(useContext(user_Detail_Context).user);
  const router = useRouter();

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
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

  const handleLogout = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .signOut()
      .then((res) => {
        // Deleting the token from local storage
        isSAdmin && localStorage.removeItem("sAdminUser");
        isAdmin && localStorage.removeItem("adminUser");
        isStaff && localStorage.removeItem("staffUser");
        isTeacher && localStorage.removeItem("teacherUser");
        isStudent && localStorage.removeItem("studentUser");
        // To Home Page
        router.push("/");
      });
  };
  return (
    <Navbar
      color="primary"
      dark
      expand="md"
      className="transition-all duration-500 ease-in-out delay-150"
    >
      <div className="d-flex align-items-center">
        <NavbarBrand href="/" className="d-lg-none">
          <Image src={LogoWhite} alt="logo" />
        </NavbarBrand>
        <Button color="primary" className="d-lg-none" onClick={showMobmenu}>
          <i className="bi bi-list"></i>
        </Button>
      </div>
      <div className="hstack gap-2">
        <Button
          color="primary"
          size="sm"
          className="d-sm-block d-md-none"
          onClick={Handletoggle}
        >
          {isOpen ? (
            <i className="bi bi-x"></i>
          ) : (
            <i className="bi bi-three-dots-vertical"></i>
          )}
        </Button>
      </div>

      <div
        className={`lg:flex md:flex justify-between w-full transition-all duration-500 ease-in-out delay-150 ${
          !isOpen ? "hidden" : ""
        }`}
        navbar
        isOpen={isOpen}
      >
        <Nav className="me-auto  no-gutters" navbar>
          <NavItem>
            <Link href="/">
              <a className="nav-link">Starter</a>
            </Link>
          </NavItem>
          <NavItem>
            <Link href="/about">
              <a className="nav-link">About</a>
            </Link>
          </NavItem>
          <UncontrolledDropdown inNavbar nav>
            <DropdownToggle caret nav>
              DD Menu
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem>Option 1</DropdownItem>
              <DropdownItem>Option 2</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Reset</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle color="primary">
            <div style={{ lineHeight: "0px" }}>
              <img
                src={
                  (isSAdmin &&
                    user &&
                    user.superadminphoto &&
                    user.superadminphoto.URL) ||
                  (isAdmin && user && user.adminphoto && user.adminphoto.URL) ||
                  (isStaff && user && user.staffphoto && user.staffphoto.URL) ||
                  (isTeacher &&
                    user &&
                    user.teacherphoto &&
                    user.teacherphoto.URL) ||
                  (isStudent &&
                    user &&
                    user.studentphoto &&
                    user.studentphoto.URL) ||
                  EmptyProfile
                }
                alt="profile"
                className="rounded-full"
                width="30"
                height="30"
              />
            </div>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Info</DropdownItem>
            <DropdownItem>{user.firstname + " " + user.lastname}</DropdownItem>
            <DropdownItem><Link href={`/${(isSAdmin && "sadmin") ||(isAdmin && "admin") || (isStaff && "staff") || (isTeacher && "teacher") || (isStudent && "student") }/dashboard/myaccount`} >My Account</Link></DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default Header;
