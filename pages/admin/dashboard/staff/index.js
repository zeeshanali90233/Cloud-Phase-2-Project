import React from 'react'
import AdminLayout from '../../../../src/layouts/AdminLayout'
import DisplayAllStaff from '../../../../src/components/DisplayAllStaff'


const index = () => {
   
  return (
    <AdminLayout>
        <DisplayAllStaff consistsAdmins={false} consistsStaff={true} consistsTeachers={true}/>
    </AdminLayout>
  )
}

export default index
