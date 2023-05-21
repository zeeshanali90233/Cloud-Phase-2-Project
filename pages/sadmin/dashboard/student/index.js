import React from "react";
import SAdminLayout from "../../../../src/layouts/SAdminLayout";
import DispAllStudents from "../../../../src/components/DispAllStudents";

const students = () => {
 

  
  return (
    <SAdminLayout>
      <DispAllStudents isStaff={false}/>
    </SAdminLayout>
  );
};

export default students;
