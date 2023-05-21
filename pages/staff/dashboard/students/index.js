import React from "react";
import StaffLayout from "../../../../src/layouts/StaffLayout";
import DispAllStudents from "../../../../src/components/DispAllStudents";

const students = () => {
 

  
  return (
    <StaffLayout>
      <DispAllStudents isStaff={true}/>
    </StaffLayout>
  );
};

export default students;
