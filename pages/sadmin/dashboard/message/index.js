import React, { useEffect, useState } from "react";
import SAdminLayout from "../../../../src/layouts/SAdminLayout";
import { useRouter } from "next/router";
import { useRef } from "react";
import firebase from "firebase/compat/app";
import { db } from "../../../../src/Firebase/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { user_Detail_Context } from "../../../../context/userContext";

const index = () => {
  const [teachers, setTeachers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [roleForm, setRoleForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const formRef = useRef();
  const router = useRouter();
  const { user, setUser } = useContext(user_Detail_Context);
  const [search, setSearch] = useState("");

  const showSuccessToast = () => {
    toast.success("Successfully Saved", {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    // Get the currently signed-in user
       var user = firebase.auth().currentUser;

       if (!user) {
        router.push("/")
       }

    const fetchUser = async () => {
      if (localStorage.getItem("sAdminUser")) {
        // Getting the id from local storage
        const userId = localStorage.getItem("sAdminUser");
        // Fetching the record from firebase
        const snapshot = await db.collection("superadmin").doc(userId).get();
        setUser({ ...snapshot.data(), firebaseId: snapshot.id });
      } else if (localStorage.getItem("adminUser")) {
        // Getting the id from local storage
        const userId = localStorage.getItem("adminUser");
        // Fetching the record from firebase
        const snapshot = await db.collection("students").doc(userId).get();
        setUser({ ...snapshot.data(), firebaseId: snapshot.id });
      } else if (localStorage.getItem("staffUser")) {
        // Getting the id from local storage
        const userId = localStorage.getItem("staffUser");
        // Fetching the record from firebase
        const snapshot = await db.collection("staff").doc(userId).get();
        setUser({ ...snapshot.data(), firebaseId: snapshot.id });
      } else if (localStorage.getItem("teacherUser")) {
        // Getting the id from local storage
        const userId = localStorage.getItem("teacherUser");
        // Fetching the record from firebase
        const snapshot = await db.collection("teacher").doc(userId).get();
        setUser({ ...snapshot.data(), firebaseId: snapshot.id });
      } else if (localStorage.getItem("studentUser")) {
        // Getting the id from local storage
        const userId = localStorage.getItem("studentUser");
        // Fetching the record from firebase
        const snapshot = await db.collection("students").doc(userId).get();
        setUser({ ...snapshot.data(), firebaseId: snapshot.id });
      }
    };

    // Getting the teachers record from firebase
    const fetchTeacher = async () => {
      await db.collection("teachers").onSnapshot((snapshot) => {
        let data = [];
        snapshot.forEach((doc) => {
          data.push({ ...doc.data(), firebaseId: doc.id });
        });
        setTeachers(data);
      });
    };
    // Getting the  Staff record from firebase
    const fetchStaff = async () => {
      await db.collection("staff").onSnapshot((snapshot) => {
        let data = [];
        snapshot.forEach((doc) => {
          data.push({ ...doc.data(), firebaseId: doc.id });
        });
        setStaff(data);
      });
    };
    // Getting the Admin record from firebase
    const fetchAdmin = async () => {
      await db.collection("admin").onSnapshot((snapshot) => {
        let data = [];
        snapshot.forEach((doc) => {
          data.push({ ...doc.data(), firebaseId: doc.id });
        });
        setAdmin(data);
      });
    };

    fetchTeacher();
    fetchStaff();
    fetchAdmin();
    fetchUser();
  }, [router.query]);

  const handleChange = (e) => {
    e.preventDefault();
    setRoleForm({ ...roleForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Current Date
    let today = new Date();
    let currentDate = today.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });

    // Current Time
    let currentTime = new Date().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    // Updating the Admin
    await db
      .collection("admin")
      .doc(roleForm.staffId)
      .update({
        assignedrole: firebase.firestore.FieldValue.arrayUnion({
          role: roleForm.role,
          date: currentDate,
          time: currentTime,
          assignedby: `${user.firstname} ${user.lastname} (${user.said})`,
        }),
      })
      .catch((err) => {});
    // Updating the staff
    await db
      .collection("staff")
      .doc(roleForm.staffId)
      .update({
        assignedrole: firebase.firestore.FieldValue.arrayUnion({
          role: roleForm.role,
          date: currentDate,
          time: currentTime,
          assignedby: `${user.firstname} ${user.lastname} (${user.said})`,
        }),
      })
      .catch((err) => {});
    //  Updating the teachers
    db.collection("teachers")
      .doc(roleForm.staffId)
      .update({
        assignedrole: firebase.firestore.FieldValue.arrayUnion({
          role: roleForm.role,
          date: currentDate,
          time: currentTime,
          assignedby: `${
            user.firstname + " " + user.lastname + "(" + user.said + ")"
          }`,
        }),
      })
      .catch((err) => {});
    setIsSaving(false);
    showSuccessToast();
    formRef.current.reset();
  };
  return (
    <SAdminLayout>
      {/* React Toastify Container */}

      <ToastContainer
        position="top-center"
        autoClose={4000}  
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
         <div className="flex items-center justify-center pb-4 ">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              name="search"
              onChange={handleSearchChange}
              className="ml-10 block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Staff"
            />
          </div>
        </div>

      <div>
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="receiverinput">
            <div>
              <label
                htmlFor="staffId"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Assign Role
              </label>
              <select
                name="staffId"
                id="staffId"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={handleChange}
              >
                <option selected>Choose a staff</option>
                {/* Admin Map */}
                {admin.map((eachStaff) => {
                    const isMatched =
                    eachStaff.aid === search.toLowerCase() ||
                    eachStaff.firstname.toLowerCase().includes(search.toLowerCase()) ||
                    eachStaff.lastname.toLowerCase().includes(search.toLowerCase()) ||
                    eachStaff.designation.toLowerCase().includes(search.toLowerCase()) ||
                    search.length === 0;
            
                  return isMatched ? (
                    <option
                      value={`${eachStaff.firebaseId}`}
                      key={eachStaff.firebaseId}
                    >
                      {eachStaff.firstname + " " + eachStaff.lastname}(
                      {eachStaff.designation},{eachStaff.aid.toUpperCase()})
                    </option>
                  ):"";
                })}
                {/* Teacher Map */}
                {teachers.map((eachStaff) => {
                    const isMatched =
                    eachStaff.tid === search.toLowerCase() ||
                    eachStaff.firstname.toLowerCase().includes(search.toLowerCase()) ||
                    eachStaff.lastname.toLowerCase().includes(search.toLowerCase()) ||
                    eachStaff.designation.toLowerCase().includes(search.toLowerCase()) ||
                    search.length === 0;
            
                  return isMatched ? (
                    <option
                      value={`${eachStaff.firebaseId}`}
                      key={eachStaff.firebaseId}
                    >
                      {eachStaff.firstname + " " + eachStaff.lastname}(
                      {eachStaff.designation},{eachStaff.tid.toUpperCase()})
                    </option>
                  ):"";
                })}

                {/* Staff Map */}
                {staff.map((eachStaff) => {
                    const isMatched =
                    eachStaff.staffid === search.toLowerCase() ||
                    eachStaff.firstname.toLowerCase().includes(search.toLowerCase()) ||
                    eachStaff.lastname.toLowerCase().includes(search.toLowerCase()) ||
                    eachStaff.designation.toLowerCase().includes(search.toLowerCase()) ||
                    search.length === 0;
            
                  return isMatched? (
                    <option
                      value={`${eachStaff.firebaseId}`}
                      key={eachStaff.firebaseId}
                    >
                      {eachStaff.firstname + " " + eachStaff.lastname}(
                      {eachStaff.designation},{eachStaff.staffid.toUpperCase()})
                    </option>
                  ):"";
                })}
              </select>
            </div>
            <div className="messageinput">
              <label
                for="message"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Message
              </label>
              <textarea
                id="message"
                rows="7"
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Write your message here..."
                onChange={(e) => {
                  handleChange(e);
                }}
                required
                type="text"
                name="role"
              ></textarea>
            </div>
          </div>
          {/* Assign Button */}
          <button
            type="submit"
            className="mt-2 w-full bg-green-600 py-2 rounded text-white hover:bg-green-500"
            disabled={isSaving}
          >
            <span className="bi bi-file-earmark-arrow-up pr-1"></span>

            {isSaving && "Assigning.."}
            {!isSaving && "Assign"}
          </button>
        </form>
      </div>
    </SAdminLayout>
  );
};

export default index;
