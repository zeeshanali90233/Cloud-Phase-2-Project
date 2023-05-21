import React from 'react'
import SAdminLayout from '../../../../src/layouts/SAdminLayout'
import DispAllFees from '../../../../src/components/DispAllFees'

const index = () => {
  return (
    <SAdminLayout>
      <DispAllFees isStaff={false}/>
    </SAdminLayout>
  )
}

export default index
