import Login from '@/components/forms/AdminLogin'
import { Role } from '@prisma/client'
import React from 'react'

type props = {}

const AdminLogin = (props: props) => {
  return (
    <div>
      <Login role={Role.Administrator} />
    </div>
  )
}

export default AdminLogin
