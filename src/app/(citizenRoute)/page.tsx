"use client"
import { Separator } from "@/components/ui/separator"
import { auth, getToken, verifyAuth } from "@/auth"
import { Button } from "@/components/ui/button"

type props = {}

const Page = (props: props) => {
  return (
    <div>
      Citizen
      <Separator />
      <Button
        onClick={async() => {
          await auth()
        }}
      >SetCookie</Button>
      <Button
        onClick={async() => {
          const newToken = await getToken()
          console.log("newToken", newToken)
          if(!newToken) return
          const verifiedToken = await verifyAuth(newToken)
          console.log(verifiedToken)
        }}
      >
        Verify Token
      </Button>
    </div>
  )
}

export default Page
