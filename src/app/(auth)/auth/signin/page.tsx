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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number is invalid").max(10, "Phone number is invalid"),
  password: z.string().min(4, "Password should have atleast 4 letters"),
}).refine(data => {
  if (data.phoneNumber.startsWith("0")) return false
  // phone number must not have any kind of alphabets or special characters or spaces
  if (!/^[0-9]*$/.test(data.phoneNumber)) return false

  return true
})

export default function Signin() {

  const [showPass, setShowPass] = useState(false)
  const [error, setError]: any = useState(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
    mode: "onChange",
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/v1/users/citizens/signin", values)
      router.push("/")
    } catch (err: any) {
      console.log(err)
      // if (err?.response.status === 500)
      //   setError("Something went wrong! Please try again later")
      // else setError(err.message)
      setError(err.response.data.error)
    }
    // setError("Something went wrong! Please try again later")
  }


  return (
    <div className="min-h-screen flex md:flex-row flex-col items-center justify-center gap-[5vw] relative">

      <Emblem />

      <Card className="border-none shadow-none w-[90%] sm:w-[60%] md:w-[40%] lg:w-[30%] xl:w-[25%]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl" >Login</CardTitle>
          <CardDescription>Welcome Back!!!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-appear-right">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter Your Phone Number..."
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
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
                      <Input
                        type={showPass ? "text" : "password"}
                        placeholder="Enter Your Password"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
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
              {
                error &&
                <Alert className="w-full" variant="destructive">
                  <ExclamationTriangleIcon className="h-5 w-5" />
                  <AlertTitle className="font-semibold">{error.title}</AlertTitle>
                  <AlertDescription className="text-sm">
                    {error.description}
                  </AlertDescription>
                </Alert>
              }
              <Button className="w-full" disabled={!form.formState.isValid || form.formState.isSubmitting} variant={"default"} type="submit">
                {
                  form.formState.isSubmitting ?
                    <Loading />
                    : "Log In"
                }
              </Button>
            </form>
          </Form>
          <p className="mt-4">
            <Link className="text-sm text-blue-500 hover:text-blue-600" href={'/auth/signup'}>
              Don&apos;t have an Account? Create One Here
            </Link>
          </p>
        </CardContent>
      </Card>


    </div>
  )
}
