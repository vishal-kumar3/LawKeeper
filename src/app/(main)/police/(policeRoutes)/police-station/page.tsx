import AddPoliceStation from '@/components/forms/PoliceOfficer/AddPoliceStation'
import Dashboard from '@/components/SubdomainDashboard/Dashboard'
import React from 'react'

type props = {}

const page = (props: props) => {
  return (
    <Dashboard title='Add New Police Station' description=''>
      <AddPoliceStation />
    </Dashboard>
  )
}

export default page
