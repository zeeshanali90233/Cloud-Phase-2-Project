import React from "react";


const isObjectEmpty = (objectName) => {
  return JSON.stringify(objectName) === "{}";
};

const StudentDetail = ({ student, enrolledCourses }) => {



  // It downloads the files
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



  return (
    <div className="main-content">
      
      <div className="adminphoto w-100 d-flex justify-content-center mt-2 mb-1">
        <img
          src={
            (student && student.studentphoto && student.studentphoto.URL) ||
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
          <div className="border-b-2 border-blue-500 ">{student.sid}</div>
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <div className="border-b-2 border-blue-500">
            {student.firstname + " " + student.lastname}
          </div>
        </div>
        <div>
          <label htmlFor="dob">Date Of Birth:</label>
          <div className="border-b-2 border-blue-500">{student.dob || "-"}</div>
        </div>
        <div>
          <label htmlFor="gender">Gender:</label>
          <div className="border-b-2 border-blue-500 capitalize">
            {student.gender || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <div className="border-b-2 border-blue-500">
            {student.address || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="phonenumber">Phone Number:</label>
          <div className="border-b-2 border-blue-500">
            {student.phone || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <div className="border-b-2 border-blue-500">
            {student.email || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="cnic">CNIC/B-Form:</label>
          <div className="border-b-2 border-blue-500">
            {student.cnic || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="parentname">Parent/Guardian Name:</label>
          <div className="border-b-2 border-blue-500">
            {student.parentname || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="parentphone">Parent/Guardian Phone:</label>
          <div className="border-b-2 border-blue-500">
            {student.parentphone || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="parentemail">Parent/Guardian Email:</label>
          <div className="border-b-2 border-blue-500">
            {student.parentemail || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="parentcnic">Parent CNIC:</label>
          <div className="border-b-2 border-blue-500">
            {student.parentcnic || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="enrolledin">Enrolled In:</label>
          <div className="border-b-2 border-blue-500">
            {(student.courses ? student.courses.length + " Courses" : "") ||
              "-"}
          </div>
        </div>
        <div>
          <label htmlFor="emergencycontname">Emergency Contact Name:</label>
          <div className="border-b-2 border-blue-500">
            {student.emergencyname || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="emergencycontno">Emergency Contact No:</label>
          <div className="border-b-2 border-blue-500">
            {student.emergencyphone || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="relationship">Relationship:</label>
          <div className="border-b-2 border-blue-500">
            {student.emergencyrelationship || "-"}
          </div>
        </div>

       
      </div>

      {enrolledCourses.length !== 0 ? (
        <div className="title bg-dark  text-center text-white w-100 mt-3 rounded">
          <h5 className="text-white">Courses</h5>
        </div>
      ) : (
        ""
      )}

      <div className="grid grid-cols-3 gap-3 mb-1">
        {enrolledCourses.length !== 0 &&
          enrolledCourses.map((course) => {
            return (
              <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-2">
                <a href="#">
                  <img
                    className="rounded-t-lg"
                    src={course.courseThumbnail && course.courseThumbnail.URL}
                    alt=""
                  />
                </a>
                <div className="p-1 text-center ">
                  <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {" "}
                      {course.courseName}({course.courseId})
                    </h5>
                  </a>
              
                </div>   
              </div>
            );
          })}
      </div>

      <div className="title bg-dark  text-center text-white w-100 rounded">
        <h5 className="text-white">Files</h5>
      </div>
      {/* File Download Buttons */}
      {!isObjectEmpty(student) ? (
        <div className="files mt-2 w-100 d-flex flex-wrap gap-1 justify-content-evenly mb-5">
          {/* Profile Photo */}
          {student &&
            student.studentphoto &&
            student.studentphoto.length !== 0 && (
              <button
                className="panel border profilephoto d-flex  px-4 py-3 align-items-center rounded justify-content-center flex-wrap"
                onClick={() => {
                  handleDownload(
                    student.studentphoto,
                    `${
                      student.firstname.toUpperCase() +
                      " " +      
                      student.lastname.toUpperCase() +
                      "(" +
                      student.sid +
                      ")"
                    }`
                  );
                }}
              >
               
                <i class="bi bi-person-bounding-box pr-1"></i>
                <h3 className="text-dark text">
                  Profile Photo</h3>
              </button>
            )}

          {/* Student CNIC */}
          {student &&
            student.studentcnicphoto &&
            student.studentcnicphoto.length !== 0 && (
              <button
                className="panel border cnic d-flex  px-4 py-3 align-items-center rounded justify-content-center"
                onClick={() => {
                  handleDownload(
                    student.studentcnicphoto,
                    `${
                      student.firstname.toUpperCase() +
                      " " +
                      student.lastname.toUpperCase() +
                      "CNIC" +
                      "(" +
                      student.sid +
                      ")"
                    }`
                  );
                }}
              >
                <i class="bi bi-credit-card pr-1"></i>
                <h3 className="text-dark text">CNIC/BForm</h3>
              </button>
            )}

          {/* Parent/Guardian CNIC */}
          {student &&
            student.parentcnicphoto &&
            student.parentcnicphoto.length !== 0 && (
              <button
                className="panel border parentcnic d-flex  px-4 py-3 align-items-center rounded justify-content-center"
                onClick={() => {
                  handleDownload(
                    student.parentcnicphoto,
                    `${
                      student.firstname.toUpperCase() +
                      " " +
                      student.lastname.toUpperCase() +
                      "Guardian CNIC" +
                      "(" +
                      student.sid +
                      ")"
                    }`
                  );
                }}
              >
                <i class="bi bi-credit-card pr-1"></i>
                <h3 className="text-dark text">Parent CNIC</h3>
              </button>
            )}
          {/* Medical Records */}
          {student &&
            student.medicalrecordsphoto &&
            student.medicalrecordsphoto.length !== 0 && (
              <button
                className="panel border medicalrecords d-flex px-4 py-3 align-items-center rounded justify-content-center"
                onClick={() => {
                  handleDownload(
                    student.medicalrecordsphoto,
                    `${
                      student.firstname.toUpperCase() +
                      " " +
                      student.lastname.toUpperCase() +
                      "MedicalRecord" +
                      "(" +
                      student.sid +
                      ")"
                    }`
                  );
                }}
              >
                <i class="bi bi-clipboard2-pulse pr-1"></i>
                <h3 className="text-dark text"> Medical Records</h3>
              </button>
            )}

          {/* Additional Records */}
          {student &&
            student.additionaldocuments &&
            student.additionaldocuments.length !== 0 && (
              <button
                className="panel border additionalfiles d-flex px-4 py-3 align-items-center rounded justify-content-center"
                onClick={() => {
                  student.additionaldocuments.forEach((eachFile, index) => {
                    handleDownload(
                      eachFile,
                      `${
                        student.firstname.toUpperCase() +
                        " " +
                        student.lastname.toUpperCase() +
                        "AdditionalFile " +
                        index +
                        1 +
                        "(" +
                        student.sid +
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

export default StudentDetail;
