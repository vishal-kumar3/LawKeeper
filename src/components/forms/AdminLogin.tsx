"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
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
import { useState } from "react"
import Loading from "@/components/loader"
import Emblem from "@/components/Emblem"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ErrorMessage from "./CustomMessage/ErrorMessage"
import SuccessMessage from "./CustomMessage/SuccessMessage"
import { useRouter } from "next/navigation"
import { adminLogin } from "@/action/admin.action"
import { Role } from "@prisma/client"

export const AdminLoginSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number is invalid").max(10, "Phone number is invalid"),
  password: z.string().min(4, "Password should have atleast 4 letters"),
}).refine(data => {
  if (!/^[0-9]*$/.test(data.phoneNumber)) return false
  if (data.phoneNumber.startsWith("0")) return false

  return true
})

export type LoginProps  = {
  role: Role
}

export default function Login({role}: LoginProps) {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const form = useForm<z.infer<typeof AdminLoginSchema>>({
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
    mode: "onChange",
  })

  const onSubmit = async (values: z.infer<typeof AdminLoginSchema>) => {
    setError("");
    setSuccess("");

    setLoadingButton(true);
    const res = await adminLogin(values, role);
    if(res?.error) setLoadingButton(false);
    if(res?.success) router.replace("/");
    setError(res?.error || "");
    setSuccess(res?.success || "");
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
              <ErrorMessage message={error} />
              <SuccessMessage message={success} />
              <Button
                className="w-full cursor-pointer font-semibold dark:disabled:opacity-50 disabled:opacity-90 disabled:cursor-not-allowed"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
                variant={"default"}
                type="submit"
              >
                {
                  form.formState.isSubmitting || loadingButton ?
                    <Loading />
                    : "Log In"
                }
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>


    </div>
  )
}
