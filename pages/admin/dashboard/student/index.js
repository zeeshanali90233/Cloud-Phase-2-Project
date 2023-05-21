import React from "react";
import AdminLayout from "../../../../src/layouts/AdminLayout";
import DispAllStudents from "../../../../src/components/DispAllStudents";

const students = () => {
 

  
  return (
    <AdminLayout>
      <DispAllStudents isStaff={false}/>
    </AdminLayout>
  );
};

export default students;
