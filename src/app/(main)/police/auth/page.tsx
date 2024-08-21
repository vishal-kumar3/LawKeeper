import Login from '@/components/forms/AdminLogin'
import { Role } from '@prisma/client'
import React from 'react'

type props = {}

const login = (props: props) => {
  return (
    <div>
      <Login role={Role.PoliceOfficer} />
    </div>
  )
}

export default login
