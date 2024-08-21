"use client"
import { getToken, setCookie, signToken, verifyAuth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type props = {}

const SubDomain = (props: props) => {
  return (
    <div>
      admin
      <Separator />
      <Button
        onClick={async () => {
          const testToken = await signToken({
            id: "IdIsHere!!!",
            name: "Admin hu mai",
            verified: false,
            role: "Administrator",
          })
          console.log(testToken)
          setCookie(testToken)
        }}
      >
        Generate & Set Cookie
      </Button>
      <Button
        onClick={async () => {
          const token = await getToken()
          if(!token) return
          const decodedToken = await verifyAuth(token)
          console.log(decodedToken)
        }}
      >
        Print Payload
      </Button>
    </div>
  )
}

export default SubDomain
