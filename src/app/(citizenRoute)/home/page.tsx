import { emailSender } from '@/action/mail.action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

type props = {}

const page = (props: props) => {
  return (
    <div>
      Home citizen
      <form action={emailSender}>
        <Input type="text" name='name' id='name' />
        <Input type="text" name='subject' id='subject' />
        <Input type="text" name='message' id='message' />
        <Input type="text" name='email' id='email' />
        <Button type='submit' >Send Mail</Button>
      </form>
    </div>
  )
}

export default page
