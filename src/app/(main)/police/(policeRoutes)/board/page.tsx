import AppointOfficersCard from '@/components/SubdomainDashboard/AppointOfficersCard'
import Dashboard from '@/components/SubdomainDashboard/Dashboard'
import React from 'react'
import { SPRB_Cards } from './CardProps'

type props = {}

const page = (props: props) => {
  return (
    <Dashboard title='State Police Recruitment Board' description='Add new recruits here...'>
      <AppointOfficersCard title='' card={SPRB_Cards} />
    </Dashboard>
  )
}

export default page
