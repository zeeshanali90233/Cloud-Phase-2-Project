import React from 'react'
import AdminLayout from "../../../../src/layouts/AdminLayout";
import DispAllCourses from '../../../../src/components/DispAllCourses';

const index = () => {
  return (
    <AdminLayout>
      <DispAllCourses showDeleteBtn={true} isStaff={false}/>
    </AdminLayout>
  )
}

export default index
