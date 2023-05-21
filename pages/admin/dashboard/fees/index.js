import React from 'react'
import AdminLayout from '../../../../src/layouts/AdminLayout'
import DispAllFees from '../../../../src/components/DispAllFees'

const index = () => {
  return (
    <AdminLayout>
      <DispAllFees isStaff={false}/>
    </AdminLayout>
  )
}

export default index
