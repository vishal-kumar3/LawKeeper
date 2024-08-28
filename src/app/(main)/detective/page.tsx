"use client"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import React from 'react'

type props = {}

const page = (props: props) => {
  return (
    <div>
      Detective
      <Separator />
      <Button
      >Show Decoded Token</Button>
    </div>
  )
}

export default page
