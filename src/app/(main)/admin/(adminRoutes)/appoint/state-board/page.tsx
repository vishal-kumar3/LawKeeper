import { getState } from '@/action/address.acton'
import { AppointBoard } from '@/components/forms/AppointBoard'
import Dashboard from '@/components/SubdomainDashboard/Dashboard'
import { State } from '@/types/address.types'
import React from 'react'

type props = {}

const AppointStateBoardMembers = async(props: props) => {

  const state: State[] = await getState();

  return (
    <Dashboard title='Appoint State Board Members' description='State board members is a govenment body to appoint officers at state level'>
      <AppointBoard state={state} />
    </Dashboard>
  )
}

export default AppointStateBoardMembers
