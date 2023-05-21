import React, { useState, useEffect } from "react";
import AdminLayout from "../../../../src/layouts/AdminLayout";
import { useRouter } from "next/router";
import { db } from "../../../../src/Firebase/config";
import "react-toastify/dist/ReactToastify.css";
import StudentFeeDetail from "../../../../src/components/StudentFeeDetail";
import StudentFeeEdit from "../../../../src/components/StudentFeeEdit";

const isObjectEmpty = (objectName) => {
  return JSON.stringify(objectName) === "{}";
};

const feesid = () => {
  const [studentFee, setStudentFee] = useState({});
  const [studentProfileImg, setStudentProfileImg] = useState("");
  const [editStudentFee, setEditStudentFee] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchStudentFees = async () => {
      // Fetching the student fees
      const feeSnapshot = await db.collection("fees").doc(id).get();
      setStudentFee({ ...feeSnapshot.data(), firebaseId: feeSnapshot.id });

      // Only fetch studentSnapshot if feeSnapshot exists and has a studentfirebaseid
      if (feeSnapshot.exists && feeSnapshot.data().studentfirebaseid) {
        // Fetching the student photo from student record
        const studentSnapshot = await db
          .collection("students")
          .doc(feeSnapshot.data().studentfirebaseid)
          .get();
        setStudentProfileImg(studentSnapshot.data()?.studentphoto?.URL || "");
      }
    };

    return fetchStudentFees();
  }, [router.query]);

  const handleEditToggle = () => {
    setEditStudentFee(!editStudentFee);
  };

  return (
    <AdminLayout>
      <div className="detail">
        <div className="text-center">
          {!editStudentFee && "Fee Detail"}
          {editStudentFee && "Fee Edit"}
        </div>

        {/* Edit Button */}
        <div className="d-flex  justify-center lg:justify-end md:justify-end  w-100 ">
          <div>
            <button
              type="submit"
              id="edit-button"
              className="border rounded px-2 py-1 w-[140px] ml-1 hover:bg-blue-600 hover:text-white"
              onClick={handleEditToggle}
            >
              {editStudentFee === false && (
                <span>
                  {" "}
                  <span className="bi bi-pen"></span> Turn Edit On
                </span>
              )}
              {editStudentFee === true && (
                <span>
                  {" "}
                  <span className="bi bi-pen"></span> Turn Edit Off
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Displaying Detail when editing is turned off */}

        {!isObjectEmpty(studentFee) && !editStudentFee && studentFee && (
          <StudentFeeDetail
            studentFee={studentFee}
            profilePic={studentProfileImg}
          />
        )}
        {!isObjectEmpty(studentFee) && editStudentFee && studentFee && (
          <StudentFeeEdit
            studentFee={studentFee}
            profilePic={studentProfileImg}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default feesid;
