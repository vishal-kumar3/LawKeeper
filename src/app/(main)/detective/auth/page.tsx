import Login from '@/components/forms/AdminLogin'
import { Role } from '@prisma/client'
import React from 'react'

type props = {}

const page = (props: props) => {
  return (
    <div>
      <Login role={Role.Detective} />
    </div>
  )
}

export default page
