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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { CircleCheckBig } from "lucide-react"
import { useEffect, useState } from "react"
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
  fullName: z.string().min(1, "Fullname is required"),
  password: z.string().min(4, "Password should have atleast 4 letters"),
  confirmPassword: z.string().min(4, "Password should have atleast 4 letters"),
  email: z.string().min(1, "Email is required").regex(new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"), "Not a valid email"),
  gender: z.enum(["Male", "Female"]),
  phoneNumber: z.string().length(10, "Not a valid phone number")
})

export default function Signup() {

  const [showPass, setShowPass] = useState(false)
  const [error, setError]: any = useState(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/v1/users/citizens/signup", values)
      router.push("/")
    } catch (err: any) {
      console.log(err)
      if (err?.response.status === 500)
        setError("Something went wrong! Please try again later")
      else setError(err.message)
    }
  }

  useEffect(() => {

      const email = form.watch("email") || ""
      const phoneNumber = form.watch("phoneNumber") || ""

      const isValidEmail = email.match("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")
      const isValidPhoneNumber = phoneNumber.match("^[0-9]{10}$")

      form.clearErrors("email")
      form.clearErrors("phoneNumber")
      const controller = new AbortController()

          ; (async () => {

              if (!phoneNumber && !email) return

              if (!isValidEmail && email) form.setError("email", { type: "value", message: "Not a valid email" })
              if (!isValidPhoneNumber && phoneNumber) form.setError("phoneNumber", { type: "value", message: "Not a valid phone number" })

              if (isValidEmail || isValidPhoneNumber) {
                  try {

                      const response = await axios.get(`/api/v1/users/citizens?email=${email}&phoneNumber=${phoneNumber}`, { signal: controller.signal })

                      const data = response.data.data

                      if (!data.email && isValidEmail)
                          form.setError("email", { type: "value", message: "Email is already taken" })

                      if (!data.phoneNumber && isValidPhoneNumber)
                          form.setError("phoneNumber", { type: "value", message: "Phone number is already taken" })

                  } catch (err) {
                      console.log(err)
                      if(axios.isCancel(err)) console.log("Previous request cancelled!")
                  }
              }

          })()

      return () => controller.abort()
  }, [form.watch("email"), form.watch("phoneNumber")])

  useEffect(() => {


      if (form.watch("password") !== undefined) {

          if (form.watch("password").length < 4)
              form.setError("password", { type: "validate", message: "Password should have atleast 4 letters" })

          else
              form.clearErrors("password")

          if (form.watch("password") === form.watch("confirmPassword")) form.clearErrors("confirmPassword")

          else
              form.setError("confirmPassword", { type: "value", message: "Confirm password should match" })

      }

  }, [form.watch("confirmPassword"), form.watch("password")])

  return (
    <div className=" min-h-screen flex md:flex-row flex-col items-center justify-center gap-[5vw] relative">
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

      <Card className="border-none shadow-none w-[90%] sm:w-[60%] md:w-[40%] lg:w-[30%] xl:w-[25%]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl" >Register</CardTitle>
          <CardDescription>Register yourself to get started!!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 animate-appear-right"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="For ex. John Paul" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="For ex. johnpaul@example.com"
                        {...field}
                      />
                    </FormControl>
                    {
                      field.value !== undefined && field.value !== "" && (form.formState.errors.email ?
                        <FormMessage />
                        : <div className="w-full text-sm flex items-center justify-start gap-2">
                          <CircleCheckBig className="text-green-600" />
                          <span className=" text-green-600">
                            Available
                          </span>
                        </div>)
                    }
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="For ex. 9477419943" {...field} />
                    </FormControl>
                    {
                      field.value !== undefined && field.value !== "" && (form.formState.errors.phoneNumber ?
                        <FormMessage />
                        : <div className="w-full text-sm flex items-center justify-start gap-2">
                          <CircleCheckBig className="text-green-600" />
                          <span className=" text-green-600">
                            Available
                          </span>
                        </div>)
                    }
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row items-center justify-start gap-10"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Male" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Male
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Female" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Female
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPass ? "text" : "password"}
                          placeholder="4+ characters"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPass ? "text" : "password"}
                          placeholder="4+ characters"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full flex items-center justify-start gap-2">
                <Checkbox id="show" onClick={() => setShowPass(prev => !prev)} />
                <label
                  htmlFor="show"
                  className="text-sm"
                >
                  Show Password
                </label>
              </div>
              <Button
                className="w-full"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
                variant={"default"}
                type="submit"
              >
                {
                  form.formState.isSubmitting ?
                    <Loading />
                    : "Register"
                }
              </Button>
            </form>
          </Form>
          <p className="mt-4">
            <Link
              className="text-sm text-blue-500 hover:text-blue-600"
              href={'/auth/signin'}
            >
              Already a user? Login here!
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
