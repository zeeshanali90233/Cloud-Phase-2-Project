import React from 'react'
import AdminLayout from '../../../../src/layouts/AdminLayout'
import DispAllDues from '../../../../src/components/DispAllDues'

const index = () => {
  return (
    <AdminLayout>
      <DispAllDues showAdmin={false}/>
    </AdminLayout>
  )
}

export default index
