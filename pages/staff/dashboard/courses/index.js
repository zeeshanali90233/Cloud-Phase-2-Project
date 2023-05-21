import React from 'react'
import StaffLayout from "../../../../src/layouts/StaffLayout";
import DispAllCourses from '../../../../src/components/DispAllCourses';

const index = () => {
  return (
    <StaffLayout>
      <DispAllCourses showDeleteBtn={true} isStaff={true}/>
    </StaffLayout>
  )
}

export default index
