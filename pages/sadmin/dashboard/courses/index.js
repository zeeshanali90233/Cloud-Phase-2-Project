import React from 'react'
import SAdminLayout from "../../../../src/layouts/SAdminLayout";
import DispAllCourses from '../../../../src/components/DispAllCourses';

const index = () => {
  return (
    <SAdminLayout>
      <DispAllCourses showDeleteBtn={true} isStaff={false}/>
    </SAdminLayout>
  )
}

export default index
