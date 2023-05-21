import React from 'react'
import AdminLayout from '../../../src/layouts/AdminLayout'
import DispAllTrans from '../../../src/components/DispAllTrans'

const transactions = () => {
  return (
    <AdminLayout>
      <DispAllTrans showDeleteBtn={true}/>
    </AdminLayout>
  )
}

export default transactions
