import React,{useContext,useEffect} from 'react'
import { saReRenderContext } from '../../pages/sadmin/dashboard/courses/[id]';
import { staffReRenderContext } from '../../pages/staff/dashboard/courses/[id]';
import { useState } from 'react';
import Image from 'next/image';
import moment from 'moment';
import { db } from '../Firebase/config';
import firebase from "firebase/compat/app";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AttendancePagination from './AttendancePagination';
import { useRouter } from 'next/router';

const CourseAttendance = () => {
    const { course, setReRenderState,hideCreateLectureButton } = useContext(saReRenderContext) || useContext(staffReRenderContext);
    const [lectureModal, setLectureModal] = useState(false);
    const [enrolledStudentData, setEnrolledStudentData] = useState([]);
    const [createLectureForm, setCreateLectureForm] = useState({
        lecturenumber: 0,
        lecturedate: moment(new Date()).format("YYYY-MM-DD"),
      });
      const [isSaving,setIsSaving]=useState(false);

      const router = useRouter();
      useEffect(() => {
        const fetchEnrolledStudentData = async () => {
          const enrolledStudentDataArray = [];
          for (const studentFirebaseId of course.enrolledStudents) {
            await db
              .collection("students")
              .doc(studentFirebaseId)
              .onSnapshot((snapshot) => {
                enrolledStudentDataArray.push({
                  ...snapshot.data(),
                  firebaseId: snapshot.id,
                });
              });
          }
          setEnrolledStudentData(enrolledStudentDataArray);
        };
        setReRenderState(Math.random());
        fetchEnrolledStudentData();
      }, [router.query]);

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
      const showErrorToast = () => {
        toast.error("Something Went Wrong", {
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

   
      // Creating the new Attendance
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try{
        let attendanceObject = {
          date: moment(createLectureForm.lecturedate).format("DD-MMM-YY"),
          lecturenumber: createLectureForm.lecturenumber,
          attendance: {},
        };
    
        for (const enrolledStudent of enrolledStudentData) {
          attendanceObject.attendance = {
            ...attendanceObject.attendance,
            [enrolledStudent.sid]: true,
          };
        }
    
        await db
          .collection("courses")
          .doc(course.firebaseId)
          .update({
            attendance: firebase.firestore.FieldValue.arrayUnion({
              ...attendanceObject,
            }),
            noOfLecturesDelivered: firebase.firestore.FieldValue.increment(1),
          });
    
          
          setIsSaving(false);
          setReRenderState(Math.random());
        setCreateLectureForm({
            lecturenumber: 0,
            lecturedate: moment(new Date()).format("YYYY-MM-DD"),
        });
        showSuccessToast();
        closeAttendanceModal();

    }
    catch(err){
        setIsSaving(false);
        showErrorToast();
    }
      };


      const handleChange = (e) => {
        e.preventDefault();
        setCreateLectureForm({
          ...createLectureForm,
          [e.target.name]: e.target.value,
        });
      };
    const closeAttendanceModal=()=>{
        setLectureModal(false);
        setCreateLectureForm({
            lecturenumber: 0,
            lecturedate: moment(new Date()).format("YYYY-MM-DD"),
          });
    }
    const showAttendanceModal=()=>{
        setLectureModal(true);
    }
  return (
    <div className='attendance mb-6'>
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

        <div className="title bg-dark  text-center text-white w-100 mt-3 rounded">
        <h5 className="text-white">Attendance</h5>
      </div>

      <div className="panel flex justify-evenly mt-1">
      {!hideCreateLectureButton && (
          <div
          className="cursor-pointer max-w-xs py-3 px-2 text-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          onClick={showAttendanceModal}
          >
              
            <div className="logo border-2 border-blue-500 rounded-full ">
              <Image
                src={"/logos/CreateLecutureAttendenceICON.png"}
                width={40}
                height={40}
              />
            </div>
            <div className="text font-bold">Create Lecture</div>
          </div>
        )}
      </div>



         {/* Create lecture modal */}
         <div
        className="fixed z-10 inset-0 overflow-y-auto select-none"
        style={{ display: lectureModal ? "block" : "none" }}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity"
            aria-hidden="true"
            onClick={closeAttendanceModal}
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full "
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <form onSubmit={handleSubmit}>
              <div className="bg-white px-3 pt-2 pb-1 sm:p-6 sm:pb-2 flex justify-center flex-col items-center">
                <div className=" flex flex-col w-full">
                  <div className=" block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    <label htmlFor='lecturenumber'>
                    Lecture Number
                    </label>
                    <input
                      id="lecturenumber"
                      type='text'
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter the Lecture Number"
                      name="lecturenumber"
                      value={createLectureForm.lecturenumber || ""}
                      required
                      min={0}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    ></input>
                  </div>
                  <div className=" block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    <label htmlFor='lecturedate'>
                    Lecture Date(MM/DD/YYYY)
                    </label>
                    <input
                      id="lecturedate"
                      type='date'
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="lecturedate"
                      value={createLectureForm.lecturedate || ""}
                      required
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    ></input>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className=" mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {!isSaving && "Create"}
                  {isSaving && "Creating..."}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeAttendanceModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    <div className='mt-2'>
    {course.attendance && course.attendance.length !== 0 && <AttendancePagination enrolledStudentData={enrolledStudentData} />}
    </div>
    </div>
  )
}

export default CourseAttendance
