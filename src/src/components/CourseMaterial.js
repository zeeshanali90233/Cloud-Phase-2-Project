import React, { useContext, useState } from "react";
import { saReRenderContext } from "../../pages/sadmin/dashboard/courses/[id]";
import { staffReRenderContext } from "../../pages/staff/dashboard/courses/[id]";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../Firebase/config";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { useRouter } from "next/router";
import { useRef } from "react";
import FilePagination from "./FilePagination";
import VideoPagination from "./VideoPagination";

const CourseMaterial = () => {
  const [addMaterialForm, setAddMaterialForm] = useState({});
  const [lectureFileError, setLectureFileError] = useState(false);
  const [lectureVideoError, setLectureVideoError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const lectureFileRef = useRef();
  const lectureVideoRef = useRef();
  const {
    setReRenderState,
    course,
    storageAddButtons,
    hideAddMaterialButton,
  } =useContext(saReRenderContext) || useContext(staffReRenderContext);

  const router = useRouter();
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

  const [showFileBox, setShowAddFileBox] = useState(false);
  const [showVideoBox, setShowVideoBox] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.name === "lecturefile") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        setLectureFileError("File size should not exceed 1MB");
        return;
      }
      setLectureFileError("");
      const fileExtension = e.target.files[0].name.substr(
        e.target.files[0].name.lastIndexOf(".")
      );
      setAddMaterialForm({
        ...addMaterialForm,
        [e.target.name]: e.target.files[0],
        fileExtension: fileExtension,
      });
      return;
    }
    setLectureVideoError("");
    setAddMaterialForm({ ...addMaterialForm, [e.target.name]: e.target.value });
  };

    // It  returns the embeded link
    const EmbedLink = (link) => {
        const videoKey = link.split("=")[1];
        const embedLink = `https://www.youtube.com/embed/${videoKey}`;
        return embedLink;
      };



  const saveLectureVideo = async (e) => {
    e.preventDefault();

    try {
      // It Validates the entered link
      if (
        !addMaterialForm.videolink.startsWith(
          "https://www.youtube.com/watch?v="
        )
      ) {
        setLectureVideoError("Invalid Link");
        return;
      }
      setIsSaving(true);
      const embedLink = EmbedLink(addMaterialForm.videolink);
      await db
        .collection("courses")
        .doc(course.firebaseId)
        .update({
          lectureVideos: firebase.firestore.FieldValue.arrayUnion({
            title: addMaterialForm.videotitle,
            videoLink: embedLink,
          }),
        });

        setIsSaving(false);
        showSuccessToast();
        setAddMaterialForm({});
        setLectureFileError("");
        setLectureVideoError("");
        setReRenderState(Math.random());
        await router.push(router.asPath);
        lectureVideoRef.current.reset();
        setShowVideoBox(false);
    } catch (err) {
        setIsSaving(false);
        showErrorToast();
        setLectureFileError("Something Went Wrong");
    }
  };

  const saveLectureFile = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Create a storage reference
      const storageRef = firebase.storage().ref();
      let lecturefileURL;

      const metadata = {
        contentType: addMaterialForm.lecturefile.type,
        customMetadata: {
          fileExtension: addMaterialForm.lecturefile.name.split(".").pop(),
        },
      };

      if (addMaterialForm.lecturefile) {
        const lecturefileSnapshot = await storageRef
          .child(`courses/${course.courseId}/${addMaterialForm.filetitle}`)
          .put(addMaterialForm.lecturefile, { metadata });
        lecturefileURL = await lecturefileSnapshot.ref.getDownloadURL();
      }
      await db
        .collection("courses")
        .doc(course.firebaseId)
        .update({
          lectureFiles: firebase.firestore.FieldValue.arrayUnion({
            fileTitle: addMaterialForm.filetitle,
            fileURL: lecturefileURL,
            metadata: metadata,
          }),
        });

      setIsSaving(false);
      showSuccessToast();
      setAddMaterialForm({});
      setLectureFileError("");
      setLectureVideoError("");
      setReRenderState(Math.random());
      await router.push(router.asPath);
      lectureFileRef.current.reset();
      setShowAddFileBox(false);
    } catch (err) {
      setIsSaving(false);
      showErrorToast();
      setLectureFileError("Something Went Wrong");
    }
  };

  const closeFileModal = (e) => {
    setShowAddFileBox(false);
    setLectureFileError("");
  };
  const closeVideoModal = (e) => {
    setShowVideoBox(false);
    setLectureVideoError("");
  };
  return (
    <div className="mb-32">
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
        <h5 className="text-white">Material</h5>
      </div>
      <div className="panel flex justify-evenly mt-1">
        {storageAddButtons &&!hideAddMaterialButton && (
          <div
            className="cursor-pointer max-w-xs py-3 px-2 text-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            onClick={() => {
              setShowAddFileBox(false);
              setShowVideoBox(!showVideoBox);
            }}
          >
            <div className="logo border-2 border-blue-500 rounded-full ">
              <Image
                src={"/logos/AddVideoLectureICON.png"}
                width={40}
                height={40}
              />
            </div>
            <div className="text font-bold">Add Lecture Video</div>
          </div>
        )}
        {storageAddButtons&&!hideAddMaterialButton && (
          <div
            className="cursor-pointer max-w-xs py-3 px-2 text-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            onClick={() => {
              setShowAddFileBox(!showFileBox);
              setShowVideoBox(false);
            }}
          >
            <div className="logo border-2 border-blue-500 rounded-full">
              <Image src={"/logos/AddFileICON.png"} width={40} height={40} />
            </div>
            <div className="text font-bold">Add Lecture Files</div>
          </div>
        )}
      </div>

      {/*Lecture File Modal */}
      <div
        className="fixed z-10 inset-0 overflow-y-auto select-none"
        style={{ display: showFileBox ? "block" : "none" }}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={closeFileModal}>
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full "
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <form onSubmit={saveLectureFile} ref={lectureFileRef}>
              <div className="bg-white  pt-2 pb-4 sm:p-6 sm:pb-4 flex justify-center flex-col items-center">
                <div className=" flex flex-col w-full">
                  <div className=" block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    <label
                      htmlFor="filetitle"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      File Title
                    </label>
                    <input
                      type="text"
                      id="filetitle"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                      name="filetitle"
                      placeholder="Enter File Title"
                      value={addMaterialForm.filetitle}
                      required
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      for="lecturefile"
                    >
                      Lecture File
                    </label>
                    <input
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      aria-describedby="file_input_help"
                      id="file_input"
                      type="file"
                      name="lecturefile"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                    <p
                      class="mt-1 text-sm text-gray-500 dark:text-gray-300"
                      id="file_input_help"
                    >
                      Max Size:1MB.
                    </p>
                    {lectureFileError.length !== 0 ? (
                      <span className="text-red-600">{lectureFileError}</span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className=" mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {!isSaving && "Save"}
                  {isSaving && "Saving..."}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeFileModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/*Lecture Video Modal */}
      <div
        className="fixed z-10 inset-0 overflow-y-auto select-none"
        style={{ display: showVideoBox ? "block" : "none" }}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={closeVideoModal}>
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full "
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <form onSubmit={saveLectureVideo} ref={lectureVideoRef}>
              <div className="bg-white px-3 pt-2 pb-1 sm:p-6 sm:pb-2 flex justify-center flex-col items-center">
                <div className=" flex flex-col w-full">
                  <div className=" block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    <label
                      htmlFor="videotitle"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Video Title
                    </label>
                    <input
                      type="text"
                      id="videotitle"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                      name="videotitle"
                      placeholder="Enter the title of video"
                      value={addMaterialForm.videotitle}
                      required
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      for="videolink"
                    >
                     Video Youtube Link
                    </label>
                    <input
                      type="text"
                      id="videolink"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                      name="videolink"
                      placeholder="Enter the video link"
                      value={addMaterialForm.videolink}
                      required
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  
                    {lectureVideoError.length !== 0 ? (
                      <span className="text-red-600">{lectureVideoError}</span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className=" mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {!isSaving && "Save"}
                  {isSaving && "Saving..."}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeVideoModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <FilePagination />
      <VideoPagination/>  
    </div>
  );
};

export default CourseMaterial;
