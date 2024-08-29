"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group"
import { CardContent, CardTitle } from "../../ui/card"

const RecruitOfficerForm = z.object({
  fullName: z.string().min(1, {
    message: "Full name must be at least 1 character.",
  }),
  email: z.string().email({ message: "Invalid email address." }),
  phoneNumber: z.string()
    .regex(new RegExp("^[0-9]{10}$"), { message: "Phone Number Is Invalid!!" }),
  profilePhoto: z.string().url({ message: "Invalid URL" }),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid Date of Birth" }),
  gender: z.enum(["Male", "Female"], { message: "Get Some Brain!!!" }),
  address: z.object({
    district: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    pincode: z.string().regex(new RegExp("^[0-9]{7}$"), { message: "Invalid Pincode" }),
  }),
  badgeNumber: z.string(),
  rank: z.string(),
  department: z.string(),
})

const RecruitOfficerPersonalInfo = [
  {
    name: "fullName" as "fullName",
    label: "Full Name",
    placeholder: "Enter Your Name...",
    type: "text",
  },
  {
    name: "email" as "email",
    label: "Email",
    placeholder: "Enter Your Email...",
    type: "email",
  },
  {
    name: "phoneNumber" as "phoneNumber",
    label: "Phone Number",
    placeholder: "Enter Your Phone Number...",
    type: "tel",
  },
  {
    name: "profilePhoto" as "profilePhoto",
    label: "Profile Photo",
    placeholder: "Enter Your Profile Photo URL...",
    type: "url",
  },
  {
    name: "dateOfBirth" as "dateOfBirth",
    label: "Date of Birth",
    placeholder: "Enter Your Date of Birth...",
    type: "date",
  },
]

const OfficerAddressForm = [
  {
    name: "district" as "district",
    label: "District",
    placeholder: "Enter Your District...",
    type: "text",
  },
  {
    name: "city" as "city",
    label: "City",
    placeholder: "Enter Your City...",
    type: "text",
  },
  {
    name: "state" as "state",
    label: "State",
    placeholder: "Enter Your State...",
    type: "text",
  },
  {
    name: "country" as "country",
    label: "Country",
    placeholder: "Enter Your Country...",
    type: "text",
  },
  {
    name: "pincode" as "pincode",
    label: "Pincode",
    placeholder: "Enter Your Pincode...",
    type: "text",
  }
]

const RecruitOfficerInfoForm = [
  {
    name: "badgeNumber" as "badgeNumber",
    label: "Badge Number",
    placeholder: "Enter Your Badge Number...",
    type: "text",
  },
  {
    name: "rank" as "rank",
    label: "Rank",
    placeholder: "Enter Your Rank...",
    type: "text",
  },
  {
    name: "department" as "department",
    label: "Department",
    placeholder: "Enter Your Department...",
    type: "text",
  }
]

export function RecruitPoliceOfficerForm() {
  const form = useForm<z.infer<typeof RecruitOfficerForm>>({
    resolver: zodResolver(RecruitOfficerForm),
    defaultValues: {
      fullName: "Vishal Kumar",
      email: "vishal@gmail.com",
      phoneNumber: "1234567890",
      profilePhoto: "https://www.google.com",
      dateOfBirth: "2005-02-02",
      gender: "Male",
      address: {
        district: "Gaya",
        city: "Gaya",
        state: "Bihar",
        country: "India",
        pincode: "800001",
      },
      badgeNumber: "12345",
      rank: "Inspector",
      department: "Police",
    },
    mode: "onChange",
  })

  function onSubmit(data: z.infer<typeof RecruitOfficerForm>) {
    console.log(`Your Submitted Data:- ${JSON.stringify(data, null, 2)}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="space-y-2">
          <CardTitle className="text-2xl">Officer&apos;s Personal Details</CardTitle>
          <div className="flex flex-col h-fit items-center md:flex-row ">
            <CardContent className="w-full px-0 sm:px-6 flex-1 order-2 space-y-6">
              {
                RecruitOfficerPersonalInfo.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                          <Input type={field.type} placeholder={field.placeholder} {...formField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))
              }
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
            </CardContent>
            <div className="bg-red-300 order-1 w-[400px] h-[500px]">
              {/* <Image src={"/images/pic1.jpg"} width={400} height={500} alt="image" className="aspect-4/5 " /> */}
            </div>
          </div>
        </div>
        <div className="space-y-2 w-full">
          <CardTitle className="text-2xl">Officer&apos;s Permanent Address</CardTitle>
          <div className="flex flex-wrap items-center justify-between md:flex-row ">
            {/* <CardContent className="flex flex-wrap w-full justify-between items-center"> */}
            <CardContent className="flex justify-between flex-wrap gap-2 px-0 sm:px-6 flex-1 order-2">
              {
                OfficerAddressForm.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={`address.${field.name}`}
                    render={({ field: formField }) => (
                      <FormItem className={`min-w-full flex-1 md:min-w-[200px]`}>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                          <Input className="" type={field.type} placeholder={field.placeholder} {...formField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))
              }
            </CardContent>
          </div>
        </div>
        <div className="space-y-2 w-full">
          <CardTitle className="text-2xl">Officer&apos;s Details</CardTitle>
          <div className="flex flex-wrap items-center justify-between md:flex-row ">
            {/* <CardContent className="flex flex-wrap w-full justify-between items-center"> */}
            <CardContent className="flex justify-between flex-wrap gap-2 px-0 sm:px-6 flex-1 order-2">
              {
                RecruitOfficerInfoForm.map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem className={`min-w-full flex-1 md:min-w-[200px]`}>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                          <Input readOnly={field.label === "Badge Number"} type={field.type} placeholder={field.placeholder} {...formField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))
              }
            </CardContent>
          </div>
        </div>
        <div className="flex justify-center">
          <Button className="w-full sm:w-[50%] lg:w-[30%]" type="submit">Add Officer</Button>
        </div>
      </form>
    </Form>
  )
}
