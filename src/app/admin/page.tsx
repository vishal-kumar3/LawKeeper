"use client"

import { useParams } from "next/navigation"

type props = {}

const SubDomain = (props: props) => {

  const params = useParams()
  const tenant = params.subdomain
  console.log(tenant)

  return (
    <div>
      admin
      {tenant}
    </div>
  )
}

export default SubDomain
