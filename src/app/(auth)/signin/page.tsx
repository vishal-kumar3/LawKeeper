"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import axios from "axios"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import Loading from "@/components/loader"
import Emblem from "@/components/Emblem"

const formSchema = z.object({
  emailOrPhoneNumber: z.string().min(1, "Email or Phone number is required"),
  password: z.string().min(4, "Password should have atleast 4 letters"),
})

export default function Signup() {

  const [showPass, setShowPass] = useState(false)
  const [error, setError]: any = useState(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/v1/users/citizens/signin", values)
      router.push("/")
    } catch (err: any) {
      console.log(err)
      if (err?.response.status === 500)
        setError("Something went wrong! Please try again later")
      else setError(err.message)
    }
    setError("Something went wrong! Please try again later")
  }


  return (
    <div className=" w-full h-[100vh] flex items-center justify-center gap-[10vw] relative">
      {
        error &&
        <Alert className=" absolute top-3 w-[40vw]" variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      }
      <Emblem />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[30%] animate-appear-right">
          <FormField
            control={form.control}
            name="emailOrPhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="For ex. johnPaul@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type={showPass ? "text" : "password"} placeholder="4+ characters" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex items-center justify-start gap-2">
            <Checkbox id="show" onClick={() => setShowPass(prev => !prev)} />
            <label
              htmlFor="show"
              className="text-sm"
            >
              Show Password
            </label>
          </div>
          <Link className="w-full block text-sm text-blue-500 hover:underline" href={'/signup'}>New user? Signup here</Link>
          <Button className="w-20 h-10" disabled={!form.formState.isValid || form.formState.isSubmitting} variant={"default"} type="submit">
            {
              form.formState.isSubmitting ?
                <Loading />
                : "Sign In"
            }
          </Button>
        </form>
      </Form>
    </div>
  )
}
