import { getState } from '@/action/address.action'
import { AppointBoard } from '@/components/forms/AppointBoard'
import Dashboard from '@/components/SubdomainDashboard/Dashboard'
import { State } from '@/types/address.types'
import React from 'react'
import AppointStateBoard from './_comp/AppointStateBoard'
import HorizontalSplit from '@/components/forms/CustomFormDesign/HorizontalSplit'

type props = {}

const AppointStateBoardMembers = async (props: props) => {

  const state: string[] = await getState();

  return (
    <Dashboard title='Appoint State Board Members' description='State board members is a govenment body to appoint officers at state level'>
      {/* <AppointStateBoard state={state} /> */}
      <HorizontalSplit
        leftClassName=''
        leftChildren={<div className=''>Holla</div>}
        rightClassName=''
        rightChildren={<div className=''>Bolla</div>}
      />
    </Dashboard>
  )
}

export default AppointStateBoardMembers
