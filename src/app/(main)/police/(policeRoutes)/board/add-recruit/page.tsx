import { RecruitPoliceOfficerForm } from '@/components/forms/PoliceOfficer/RecruitPoliceOfficer'
import Dashboard from '@/components/SubdomainDashboard/Dashboard'
import React from 'react'

type props = {}

const page = (props: props) => {
  return (
    <Dashboard title='Add New Recruits' description=''>
      <RecruitPoliceOfficerForm />
    </Dashboard>
  )
}

export default page
