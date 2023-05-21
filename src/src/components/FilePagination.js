import React, { useContext } from "react";
import { saReRenderContext } from "../../pages/sadmin/dashboard/courses/[id]";
import { staffReRenderContext } from "../../pages/staff/dashboard/courses/[id]";
import { useState } from "react";
import firebase from "firebase/compat/app";
import { db } from "../Firebase/config";

const FilePagination = () => {
  const { course, setReRenderState ,storageDeleteButtons} = useContext(saReRenderContext) || useContext(staffReRenderContext);
  const [confirmModal, setConfirmModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState("");
  const [isDeleting, setIsDeleting] = useState("");
  // For Table Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;
  // Logic for displaying current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = course?.lectureFiles.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  // Logic for displaying page numbers
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(course.lectureFiles?.length / itemsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  // It downloads the files
  const handleDownload = (file, fileTitle = "") => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      file.fileURL || file.courseOutlineFileURL || file.additionalFileURL,
      true
    );
    xhr.responseType = "blob";
    xhr.onload = function (event) {
      const blob = xhr.response;
      // Set the content-disposition header to specify the original file type and extension
      const contentDispositionHeader = `attachment; filename=${
        file.fileTitle || fileTitle
      }.${file.metadata.customMetadata.fileExtension};`;

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${file.fileTitle || fileTitle}.${
        file.metadata.customMetadata.fileExtension
      }`;
      link.setAttribute("style", "display: none;");
      link.setAttribute(
        "download",
        `${file.fileTitle || fileTitle}.${
          file.metadata.customMetadata.fileExtension
        }`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    xhr.send();
  };

  const closeConfirmModal = () => {
    setConfirmModal(false);
  };
  const showConfirmModal = () => {
    setConfirmModal(true);
  };
  // It Deletes the file
  const handleFileDelete = async (e) => {
    e.preventDefault();
    setIsDeleting(true);
    await firebase
      .storage()
      .refFromURL(fileToDelete.fileURL)
      .delete()
      .then((res) => {
        db.collection("courses")
          .doc(course.firebaseId)
          .update({
            lectureFiles:
              firebase.firestore.FieldValue.arrayRemove(fileToDelete),
          });
        closeConfirmModal();
        setFileToDelete("");
        setReRenderState(Math.random());
        setIsDeleting(false);
    })
    .catch((err) => {
          setIsDeleting(false);
      });
  };


  const goToPage=(pageNum)=>{
    setCurrentPage(pageNum);
  }

  return (
    <div className="mt-1">
      {/*File Confirmation Modal */}
      <div
        className="fixed z-10 inset-0 overflow-y-auto"
        style={{ display: confirmModal ? "block" : "none" }}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <form>
              <div className="bg-white px-4 pt-2 sm:p-6 flex justify-center flex-col items-center">
                <div className="sm:flex sm:items-start flex flex-col ">
                  <div className=" text-center sm:mt-0 sm:ml-4 sm:text-left mt-1">
                    <label
                      htmlFor="password"
                      className="block mb-2 font-medium text-gray-900 dark:text-white text-2xl"
                    >
                      Are you sure to delete this file
                    </label>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-1 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className=" mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleFileDelete}
                >
                  {!isDeleting && "Confirm&Delete"}
                  {isDeleting && "Deleting..."}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeConfirmModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Files
              </th>
              <th scope="col" className="py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium  whitespace-nowrap dark:text-white text-blue-500 cursor-pointer underline"
              >
                Outline File
              </th>
              <td className="px-6 py-4">
                <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline"></a>
              </td>
            </tr>
            <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium  whitespace-nowrap dark:text-white  text-blue-500 cursor-pointer underline"
              >
                Additional Files
              </th>

              <td className="px-6 py-4">
                <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline"></a>
              </td>
            </tr>

            {currentItems.map((row) => {
              return (
                <tr
                  className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                  key={row.fileTitle}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer hover:underline hover:text-blue-500"
                    onClick={() => {
                      handleDownload(row);
                    }}
                  >
                    {row.fileTitle}
                  </th>

                  <td
                    className=" py-4 cursor-pointer text-center"
                   
                  >
                   {storageDeleteButtons &&  <a className="font-medium text-red-600 dark:text-red-500 hover:underline "  onClick={() => {
                      showConfirmModal();
                      setFileToDelete(row);
                    }}>
                      Delete
                    </a>}
                  </td>
                </tr>
              );
            })}

          </tbody>
        </table>
            {/* Pagination Panel */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 w-full">
              <div className="flex flex-1 justify-between sm:hidden w-full">
                <a
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"  onClick={()=>{currentPage!==1 &&  goToPage(currentPage-1)}}
                >
                  Previous
                </a>
                <a
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={()=>{currentPage<(course?.lectureFiles?.length/itemsPerPage) &&  goToPage(currentPage+1)}}
                >
                  Next
                </a>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <th>
                  <p className="text-sm text-gray-700">
                    Showing
                    <span className="font-medium ml-1">{indexOfFirstItem+1}</span>
                    to
                    <span className="font-medium ml-1">{indexOfLastItem}</span>
                    of
                    <span className="font-medium ml-1">{course?.lectureFiles?.length}</span>
                    results
                  </p>
                </th>
                <td>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm w-full"
                    aria-label="Pagination"
                  >
                    <a
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      onClick={()=>{currentPage!==1 &&  goToPage(currentPage-1)}}
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </a>
                    {/* <!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" --> */}

                    {pageNumbers.map((pageNum) => {
                      return (
                        <a
                          aria-current="page"
                          className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                          onClick={()=>{goToPage(pageNum)}}
                        >
                          {pageNum}
                        </a>
                      );
                    })}

                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                      ...
                    </span>

                    <a
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      onClick={()=>{currentPage<(course?.lectureFiles?.length/itemsPerPage) &&  goToPage(currentPage+1)}}
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </a>
                  </nav>
                </td>
              </div>
            </div>
      </div>
    </div>
  );
};

export default FilePagination;
