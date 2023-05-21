import React from 'react'



const isObjectEmpty = (objectName) => {
  return JSON.stringify(objectName) === "{}";
};


const AdminDetail = ({admin}) => {
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
    <div className='main-content'>
         <div className="adminphoto w-100 d-flex justify-content-center mt-2 mb-1">
        <img
          src={
            (admin && admin.adminphoto && admin.adminphoto.URL) ||
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
          <div className="border-b-2 border-blue-500 ">{admin.aid}</div>
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <div className="border-b-2 border-blue-500">
            {admin.firstname + " " + admin.lastname}
          </div>
        </div>
        <div>
          <label htmlFor="dob">Date Of Birth:</label>
          <div className="border-b-2 border-blue-500">{admin.dob || "-"}</div>
        </div>
        <div>
          <label htmlFor="gender">Gender:</label>
          <div className="border-b-2 border-blue-500 capitalize">
            {admin.gender || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <div className="border-b-2 border-blue-500">
            {admin.address || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="phonenumber">Phone Number:</label>
          <div className="border-b-2 border-blue-500">
            {admin.phone || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <div className="border-b-2 border-blue-500">
            {admin.email || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="cnic">CNIC/B-Form:</label>
          <div className="border-b-2 border-blue-500">
            {admin.cnic || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="parentname">Qualification:</label>
          <div className="border-b-2 border-blue-500">
            {admin.education || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="parentphone">Institute Name:</label>
          <div className="border-b-2 border-blue-500">
            {admin.institutename || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="parentemail">Passing Year:</label>
          <div className="border-b-2 border-blue-500">
            {admin.yearofpass || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="parentcnic">CGPA:</label>
          <div className="border-b-2 border-blue-500">
            {admin.cgpa || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="enrolledin">Designation:</label>
          <div className="border-b-2 border-blue-500">
            {admin.designation || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="enrolledin">Salary:</label>
          <div className="border-b-2 border-blue-500">
            {admin.initsalary || "-"}
          </div>
        </div>

   
        <div>
          <label htmlFor="emergencycontname">Emergency Contact Name:</label>
          <div className="border-b-2 border-blue-500">
            {admin.emergencyname || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="emergencycontno">Emergency Contact No:</label>
          <div className="border-b-2 border-blue-500">
            {admin.emergencyphone || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="relationship">Relationship:</label>
          <div className="border-b-2 border-blue-500">
            {admin.emergencyrelationship || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="relationship">Manage Salary Records:</label>
          <div className="border-b-2 border-blue-500">
            {admin.canmanagesalary === "true" || admin.canmanagesalary? "Yes" : "No"}
          </div>
        </div>
       
      </div>


      <div className=" mt-2 title bg-dark  text-center text-white w-100 rounded">
        <h5 className="text-white">Files</h5>
      </div>
      {/* File Download Buttons */}
      {!isObjectEmpty(admin) ? (
        <div className="files mt-2 w-100 d-flex flex-wrap gap-1 justify-content-evenly mb-5">
          {/* Profile Photo */}
          {admin &&
            admin.adminphoto &&
            admin.adminphoto.length !== 0 && (
              <button
                className="panel border profilephoto d-flex  px-4 py-3 align-items-center rounded justify-content-center flex-wrap"
                onClick={() => {
                  handleDownload(
                    admin.adminphoto,
                    `${
                      admin.firstname.toUpperCase() +
                      " " +
                      admin.lastname.toUpperCase() +
                      "(" +
                      admin.aid +
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

          {/* admin CNIC */}
          {admin &&
            admin.admincnicphoto &&
            admin.admincnicphoto.length !== 0 && (
              <button
                className="panel border cnic d-flex  px-4 py-3 align-items-center rounded justify-content-center"
                onClick={() => {
                  handleDownload(
                    admin.admincnicphoto,
                    `${
                      admin.firstname.toUpperCase() +
                      " " +
                      admin.lastname.toUpperCase() +
                      "CNIC" +
                      "(" +
                      admin.aid +
                      ")"
                    }`
                  );
                }}
              >
                <i class="bi bi-credit-card pr-1"></i>
                <h3 className="text-dark text">CNIC</h3>
              </button>
            )}

          {/* CV*/}
          {admin &&
            admin.cv &&
            admin.cv.length !== 0 && (
              <button
                className="panel border parentcnic d-flex  px-4 py-3 align-items-center rounded justify-content-center"
                onClick={() => {
                  handleDownload(
                    admin.cv,
                    `${
                      admin.firstname.toUpperCase() +
                      " " +
                      admin.lastname.toUpperCase() +
                      "CV" +
                      "(" +
                      admin.aid +
                      ")"
                    }`
                  );
                }}
              >
                <i class="bi bi-credit-card pr-1"></i>
                <h3 className="text-dark text">CV</h3>
              </button>
            )}

            {/* {Degree File} */}
          {admin &&
            admin.degreefile &&
            admin.degreefile.length !== 0 && (
              <button
                className="panel border parentcnic d-flex  px-4 py-3 align-items-center rounded justify-content-center"
                onClick={() => {
                  handleDownload(
                    admin.degreefile,
                    `${
                      admin.firstname.toUpperCase() +
                      " " +
                      admin.lastname.toUpperCase() +
                      "CV" +
                      "(" +
                      admin.aid +
                      ")"
                    }`
                  );
                }}
              >
                <i class="bi bi-credit-card pr-1"></i>
                <h3 className="text-dark text">Degree File</h3>
              </button>
            )}

          {/* Medical Records */}
          {admin &&
            admin.medicalrecordsphoto &&
            admin.medicalrecordsphoto.length !== 0 && (
              <button
                className="panel border medicalrecords d-flex px-4 py-3 align-items-center rounded justify-content-center"
                onClick={() => {
                  handleDownload(
                    admin.medicalrecordsphoto,
                    `${
                      admin.firstname.toUpperCase() +
                      " " +
                      admin.lastname.toUpperCase() +
                      "MedicalRecord" +
                      "(" +
                      admin.sid +
                      ")"
                    }`
                  );
                }}
              >
            <i class="bi bi-journal-medical"></i>
                <h3 className="text-dark text"> Medical Records</h3>
              </button>
            )}

          {/* Additional Records */}
          {admin &&
            admin.additionaldocuments &&
            admin.additionaldocuments.length !== 0 && (
              <button
                className="panel border additionalfiles d-flex px-4 py-3 align-items-center rounded justify-content-center"
                onClick={() => {
                  admin.additionaldocuments.forEach((eachFile, index) => {
                    handleDownload(
                      eachFile,
                      `${
                        admin.firstname.toUpperCase() +
                        " " +
                        admin.lastname.toUpperCase() +
                        "AdditionalFile " +
                        index +
                        1 +
                        "(" +
                        admin.sid +
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
  )
}

export default AdminDetail
