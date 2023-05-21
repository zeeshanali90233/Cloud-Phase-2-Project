import React from 'react'
import SAdminLayout from '../../../../src/layouts/SAdminLayout'
import DispAllDues from '../../../../src/components/DispAllDues'

const index = () => {
  return (
    <SAdminLayout>
      <DispAllDues showAdmin={true}/>
    </SAdminLayout>
  )
}

export default index
