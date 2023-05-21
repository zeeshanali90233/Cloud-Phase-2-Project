import React from "react";

const isObjectEmpty = (objectName) => {
  return JSON.stringify(objectName) === "{}";
};

const StaffDetail = ({ staff, authorities }) => {
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
      <div className="staffphoto w-100 d-flex justify-content-center mt-2 mb-1">
        <img
          src={
            (staff && staff.staffphoto && staff.staffphoto.URL) ||
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
          <div className="border-b-2 border-blue-500 ">{staff.staffid}</div>
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <div className="border-b-2 border-blue-500">
            {staff.firstname + " " + staff.lastname}
          </div>
        </div>
        <div>
          <label htmlFor="dob">Date Of Birth:</label>
          <div className="border-b-2 border-blue-500">{staff.dob || "-"}</div>
        </div>
        <div>
          <label htmlFor="gender">Gender:</label>
          <div className="border-b-2 border-blue-500 capitalize">
            {staff.gender || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <div className="border-b-2 border-blue-500">
            {staff.address || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="phonenumber">Phone Number:</label>
          <div className="border-b-2 border-blue-500">{staff.phone || "-"}</div>
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <div className="border-b-2 border-blue-500">{staff.email || "-"}</div>
        </div>
        <div>
          <label htmlFor="cnic">CNIC:</label>
          <div className="border-b-2 border-blue-500">{staff.cnic || "-"}</div>
        </div>
        <div>
          <label htmlFor="parentname">Education:</label>
          <div className="border-b-2 border-blue-500 capitalize">
            {staff.education || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="parentphone">Institute Name:</label>
          <div className="border-b-2 border-blue-500">
            {staff.institutename || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="parentemail">Passing Year:</label>
          <div className="border-b-2 border-blue-500">
            {staff.yearofpass || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="parentcnic">Designation:</label>
          <div className="border-b-2 border-blue-500">
            {staff.designation || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="enrolledin">Salary:</label>
          <div className="border-b-2 border-blue-500">
            {staff.initsalary || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="emergencycontname">Emergency Contact Name:</label>
          <div className="border-b-2 border-blue-500">
            {staff.emergencyname || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="emergencycontno">Emergency Contact No:</label>
          <div className="border-b-2 border-blue-500">
            {staff.emergencyphone || "-"}
          </div>
        </div>

        <div>
          <label htmlFor="relationship">Relationship:</label>
          <div className="border-b-2 border-blue-500">
            {staff.emergencyrelationship || "-"}
          </div>
        </div>

      </div>

      <div className=" mt-3 title bg-dark  text-center text-white w-100 rounded">
        <h5 className="text-white">Authorities</h5>
      </div>

      {/* Authorities Table */}
      <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3"></th>
              <th scope="col" class="px-6 py-3">
                Review
              </th>
              <th scope="col" class="px-6 py-3">
                Add
              </th>
              <th scope="col" class="px-6 py-3">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            {authorities.map((auth) => {
              return (
                <tr
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  key={auth.name}
                >
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {auth.authorityname}
                  </th>
                  <td class="px-6 py-4">{auth.review ? "✓" : "🗴"}</td>
                  <td class="px-6 py-4">{auth.add ? "✓" : "🗴"}</td>
                  <td class="px-6 py-4">{auth.edit ? "✓" : "🗴"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* File Download Buttons */}
      {!isObjectEmpty(staff) ? (
        <div className="files mt-2 w-100 d-flex flex-wrap gap-1 justify-content-evenly mb-5">
          {/* Profile Photo */}
          {staff && staff.staffphoto && staff.staffphoto.length !== 0 && (
            <button
              className="panel border profilephoto d-flex  px-4 py-3 align-items-center rounded justify-content-center flex-wrap"
              onClick={() => {
                handleDownload(
                  staff.staffphoto,
                  `${
                    staff.firstname.toUpperCase() +
                    " " +
                    staff.lastname.toUpperCase() +
                    "(" +
                    staff.staffid +
                    ")"
                  }`
                );
              }}
            >
              <i class="bi bi-person-bounding-box pr-1"></i>
              <h3 className="text-dark text">Profile Photo</h3>
            </button>
          )}

          {/* staff CNIC */}
          {staff &&
            staff.staffcnicphoto &&
            staff.staffcnicphoto.length !== 0 && (
              <button
                className="panel border cnic d-flex  px-4 py-3 align-items-center rounded justify-content-center"
                onClick={() => {
                  handleDownload(
                    staff.staffcnicphoto,
                    `${
                      staff.firstname.toUpperCase() +
                      " " +
                      staff.lastname.toUpperCase() +
                      "CNIC" +
                      "(" +
                      staff.staffid +
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
          {staff &&
            staff.medicalrecordsphoto &&
            staff.medicalrecordsphoto.length !== 0 && (
              <button
                className="panel border medicalrecords d-flex px-4 py-3 align-items-center rounded justify-content-center"
                onClick={() => {
                  handleDownload(
                    staff.medicalrecordsphoto,
                    `${
                      staff.firstname.toUpperCase() +
                      " " +
                      staff.lastname.toUpperCase() +
                      "MedicalRecord" +
                      "(" +
                      staff.staffid +
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
          {staff &&
            staff.additionaldocuments &&
            staff.additionaldocuments.length !== 0 && (
              <button
                className="panel border additionalfiles d-flex px-4 py-3 align-items-center rounded justify-content-center"
                onClick={() => {
                  staff.additionaldocuments.forEach((eachFile, index) => {
                    handleDownload(
                      eachFile,
                      `${
                        staff.firstname.toUpperCase() +
                        " " +
                        staff.lastname.toUpperCase() +
                        "AdditionalFile " +
                        index +
                        1 +
                        "(" +
                        staff.staffid +
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

export default StaffDetail;
