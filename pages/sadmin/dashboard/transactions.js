import React from 'react'
import SAdminLayout from '../../../src/layouts/SAdminLayout'
import DispAllTrans from '../../../src/components/DispAllTrans'

const transactions = () => {
  return (
    <SAdminLayout>
      <DispAllTrans showDeleteBtn={true}/>
    </SAdminLayout>
  )
}

export default transactions
