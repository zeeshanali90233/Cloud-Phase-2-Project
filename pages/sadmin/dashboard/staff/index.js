import React from 'react'
import SAdminLayout from '../../../../src/layouts/SAdminLayout'
import DisplayAllStaff from '../../../../src/components/DisplayAllStaff'


const index = () => {
   
  return (
    <SAdminLayout>
        <DisplayAllStaff consistsAdmins={true} consistsStaff={true} consistsTeachers={true}/>
    </SAdminLayout>
  )
}

export default index
