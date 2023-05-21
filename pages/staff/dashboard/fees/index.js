import React from 'react'
import StaffLayout from '../../../../src/layouts/StaffLayout'
import DispAllFees from '../../../../src/components/DispAllFees'

const index = () => {
  return (
    <StaffLayout>
      <DispAllFees isStaff={true}/>
    </StaffLayout>
  )
}

export default index
