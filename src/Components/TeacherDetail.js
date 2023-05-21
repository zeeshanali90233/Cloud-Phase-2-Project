import { useRouter } from "next/router";
import React from "react";

const isObjectEmpty = (objectName) => {
  return JSON.stringify(objectName) === "{}";
};

const TeacherDetail = ({ teacher, coursesInstructor }) => {
  const router = useRouter();

  const handleDownload = (file, fileTitle = "") => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", file.URL, true);
    xhr.responseType = "blob";
    xhr.onload = function (event) {
      const blob = xhr.response;
      // Set the content-disposition header to specify the original file type and extension
      const contentDispositionHeader = `attachment; filename=${fileTitle}.${file.metadata.customMetadata.fileExtension};`;

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${fileTitle}.${file.metadata.customMetadata.fileExtension}`;
      link.setAttribute("style", "display: none;");
      link.setAttribute(
        "download",
        `${fileTitle}.${file.metadata.customMetadata.fileExtension}`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    xhr.send();
  };

  const handleCourseClick = (e, courseFId) => {
    e.preventDefault();
    const detPath =
      router.pathname.split("/")[1] +
      "/" +
      router.pathname.split("/")[2] +
      "/courses/" +
      courseFId;
    router.push(`/${detPath}`);
  };

  return (
    <div className="main-content">
      <div className="studentphoto w-100 d-flex justify-content-center mt-2 mb-1">
        <img
          src={
            (teacher && teacher.teacherphoto && teacher.teacherphoto.URL) ||
            "/no_profile_picture.jpeg"
          }
          alt="profile"
          className="rounded-circle"
          width={150}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="sid">ID:</label>
          <div className="border-b-2 border-blue-500 ">{teacher.tid}</div>
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <div className="border-b-2 border-blue-500">
            {teacher.firstname + " " + teacher.lastname}
          </div>
        </div>
        <div>
          <label htmlFor="dob">Date Of Birth:</label>
          <div className="border-b-2 border-blue-500">{teacher.dob || "-"}</div>
        </div>
        <div>
          <label htmlFor="gender">Gender:</label>
          <div className="border-b-2 border-blue-500 capitalize">
            {teacher.gender || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <div className="border-b-2 border-blue-500">
            {teacher.address || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="phonenumber">Phone Number:</label>
          <div className="border-b-2 border-blue-500">
            {teacher.phone || "-"}
          </div>
        </div>
        <div className="overflow-x-auto">
          <label htmlFor="email">Email:</label>
          <div className="border-b-2 border-blue-500">
            {teacher.email || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="cnic">CNIC:</label>
          <div className="border-b-2 border-blue-500">
            {teacher.cnic || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="cnic">Designation:</label>
          <div className="border-b-2 border-blue-500">
            {teacher.designation || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="cnic">Salary:</label>
          <div className="border-b-2 border-blue-500">
            {teacher.initsalary || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="parentname">Degree:</label>
          <div className="border-b-2 border-blue-500 capitalize">
            {teacher.degree || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="parentphone">Institute Name:</label>
          <div className="border-b-2 border-blue-500">
            {teacher.institutename || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="parentemail">Passing Year:</label>
          <div className="border-b-2 border-blue-500">
            {teacher.passingyear || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="parentcnic">Designation:</label>
          <div className="border-b-2 border-blue-500">
            {teacher.designation || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="enrolledin">CGPA:</label>
          <div className="border-b-2 border-blue-500">
            {teacher.obtgpa || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="emergencycontname">Emergency Contact Name:</label>
          <div className="border-b-2 border-blue-500">
            {teacher.emergencyname || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="emergencycontno">Emergency Contact No:</label>
          <div className="border-b-2 border-blue-500">
            {teacher.emergencyphone || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="relationship">Relationship:</label>
          <div className="border-b-2 border-blue-500">
            {teacher.emergencyrelationship || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="relationship">Instructor of Courses:</label>
          <div className="border-b-2 border-blue-500">
            {(teacher.courses && teacher.courses.length) || "-"}
          </div>
        </div>
      </div>

      {coursesInstructor && coursesInstructor.length !== 0 && (
        <div className=" mt-3 title bg-dark  text-center text-white w-100 rounded">
          <h5 className="text-white">Instructor Of Following Courses</h5>
        </div>
      )}

      {coursesInstructor &&
        coursesInstructor.length !== 0 &&
        coursesInstructor.map((course) => {
          return (
            <div
              className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer select-none mt-2"
              key={course.firebaseId}
              onClick={(e) => handleCourseClick(e, course.firebaseId)}
            >
              <div className="flex flex-col items-center pb-10 mt-3">
                <img
                  className="w-24 h-24 mb-3 rounded-full shadow-lg"
                  src={course.courseThumbnail.URL || "/no_profile_picture.jpeg"}
                  alt="Course image"
                />
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                  {course.courseName}({course.courseId.toUpperCase()})
                </h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {course.courseDesc.match(/(\b\w+\b[\s,]*){1,5}/g)}
                </span>
                <div className="flex mt-4 space-x-3 md:mt-6"></div>
              </div>
            </div>
          );
        })}

      <div className=" mt-3 title bg-dark  text-center text-white w-100 rounded">
        <h5 className="text-white">Files</h5>
      </div>

      {/* File Download Buttons */}
      {!isObjectEmpty(teacher) ? (
        <div className="files mt-2 w-100 d-flex flex-wrap gap-1 justify-content-evenly mb-5">
          {/* Profile Photo */}
          {teacher &&
            teacher.teacherphoto &&
            teacher.teacherphoto.length !== 0 && (
              <button
                className="panel border profilephoto d-flex  px-4 py-3 align-items-center rounded justify-content-center flex-wrap"
                onClick={() => {
                  handleDownload(
                    teacher.teacherphoto,
                    `${
                      teacher.firstname.toUpperCase() +
                      " " +
                      teacher.lastname.toUpperCase() +
                      "(" +
                      teacher.tid +
                      ")"
                    }`
                  );
                }}
              >
                <i class="bi bi-person-bounding-box pr-1"></i>
                <h3 className="text-dark text">Profile Photo</h3>
              </button>
            )}

          {/* teacher CNIC */}
          {teacher &&
            teacher.teachercnicphoto &&
            teacher.teachercnicphoto.length !== 0 && (
              <button
                className="panel border cnic d-flex  px-4 py-3 align-items-center rounded justify-content-center"
                onClick={() => {
                  handleDownload(
                    teacher.teachercnicphoto,
                    `${
                      teacher.firstname.toUpperCase() +
                      " " +
                      teacher.lastname.toUpperCase() +
                      "CNIC" +
                      "(" +
                      teacher.tid +
                      ")"
                    }`
                  );
                }}
              >
                <i class="bi bi-credit-card pr-1"></i>
                <h3 className="text-dark text">CNIC</h3>
              </button>
            )}

          {/* Medical Records */}
          {teacher &&
            teacher.medicalrecordsphoto &&
            teacher.medicalrecordsphoto.length !== 0 && (
              <button
                className="panel border medicalrecords d-flex px-4 py-3 align-items-center rounded justify-content-center"
                onClick={() => {
                  handleDownload(
                    teacher.medicalrecordsphoto,
                    `${
                      teacher.firstname.toUpperCase() +
                      " " +
                      teacher.lastname.toUpperCase() +
                      "MedicalRecord" +
                      "(" +
                      teacher.tid +
                      ")"
                    }`
                  );
                }}
              >
                <i class="bi bi-journal-medical"></i>
                <h3 className="text-dark text"> Medical Records</h3>
              </button>
            )}

          {/* Degree File */}
          {teacher && teacher.degreefile && teacher.degreefile.length !== 0 && (
            <button
              className="panel border medicalrecords d-flex px-4 py-3 align-items-center rounded justify-content-center"
              onClick={() => {
                handleDownload(
                  teacher.degreefile,
                  `${
                    teacher.firstname.toUpperCase() +
                    " " +
                    teacher.lastname.toUpperCase() +
                    "DegreeFile" +
                    "(" +
                    teacher.tid +
                    ")"
                  }`
                );
              }}
            >
              <i class="bi bi-clipboard2-pulse pr-1"></i>
              <h3 className="text-dark text">Degree File</h3>
            </button>
          )}

          {/* Additional Records */}
          {teacher &&
            teacher.additionaldocuments &&
            teacher.additionaldocuments.length !== 0 && (
              <button
                className="panel border additionalfiles d-flex px-4 py-3 align-items-center rounded justify-content-center"
                onClick={() => {
                  teacher.additionaldocuments.forEach((eachFile, index) => {
                    handleDownload(
                      eachFile,
                      `${
                        teacher.firstname.toUpperCase() +
                        " " +
                        teacher.lastname.toUpperCase() +
                        "AdditionalFile " +
                        index +
                        1 +
                        "(" +
                        teacher.tid +
                        ")"
                      }`
                    );
                  });
                }}
              >
                <i class="bi bi-file-earmark-ruled pr-1"></i>
                <h3 className="text-dark text">Additional Files</h3>
              </button>
            )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default TeacherDetail;
