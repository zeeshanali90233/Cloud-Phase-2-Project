import React from "react";
import SAdminLayout from "../../../../src/layouts/SAdminLayout";
import { useRouter } from "next/router";

const index = () => {
    const router=useRouter();

    const goTo=(urlSlug)=>{
        router.push(router.pathname+"/"+urlSlug)
    }
  return (
    <SAdminLayout>
      <div className="adm-container mt-48">
        <div className="panels grid grid-cols-3 gap-3">
            {/* Student Panel */}
          <div className="std-panel py-6 px-3 rounded cursor-pointer bg-white flex max-w-sm justify-start items-center" onClick={()=>{goTo("addstudent")}}> 
            <div className="border-2 border-blue-500 rounded">
              <img src={"/logos/AddStudentICON.png"} alt="" width={50} />
            </div>
            <span className="text font-bold ml-2">Add Student</span>
          </div>
          {/* Teacher Panel */}
          <div className="std-panel py-6 px-3 rounded cursor-pointer bg-white flex max-w-sm justify-start items-center" onClick={()=>{goTo("addteacher")}}>
            <div className="border-2 border-blue-500 rounded">
              <img src={"/logos/AddTeacherICON.png"} alt="" width={50} />
            </div>
            <span className="text font-bold ml-2">Add Teacher/Instructor</span>
          </div>
          {/* Staff Panel */}
          <div className="std-panel py-6 px-3 rounded cursor-pointer bg-white flex max-w-sm justify-start items-center" onClick={()=>{goTo("addstaff")}}>
            <div className="border-2 border-blue-500 rounded">
              <img src={"/logos/AddStaffICON.png"} alt="" width={50} />
            </div>
            <span className="text font-bold ml-2">Add Staff</span>
          </div>
        </div>
      </div>
    </SAdminLayout>
  );
};

export default index;
