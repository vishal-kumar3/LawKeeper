
import { AssignStationForm } from '@/components/forms/PoliceOfficer/AssignStationForm'
import Dashboard from '@/components/SubdomainDashboard/Dashboard'
import prisma from '@/prisma'
import { State } from '@/types/address.types'
import React from 'react'

type props = {}

const AssingStation = async(props: props) => {

  const state: State[] = await prisma.address.findMany({
    distinct: ['state'],
    select: {
      state: true,
    },
  })
  .catch((error) => {
    console.error(error)
    return []
  })

  return (
    <Dashboard title='Assign Station To Officer' description=''>
      <AssignStationForm state={state} />
    </Dashboard>
  )
}

export default AssingStation
