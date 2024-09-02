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
import { CardContent, CardTitle } from "../ui/card"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import PictureAndForm from "./PictureAndForm"
import { AssignStationForm } from "./PoliceOfficer/AssignStationForm"
import { AddressForm } from "./AddressSearch"
import { State } from "@/types/address.types"
import { AddAddressForm } from "./AddAddressForm"


const PoliceStationForm = z.object({
  fullName: z.string().min(1, { message: "Station Name must be at least 1 character." }),
  address: z.object({
    district: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    pincode: z.string().regex(new RegExp("^[0-9]{7}$"), { message: "Invalid Pincode" }),
  }),
  profilePhoto: z.string().url({ message: "Invalid URL" }),
  role: z.string(),
  gender: z.enum(["Male", "Female", ""], { message: "Get some brain!!!" }),
  email: z.string().email({ message: "Invalid email address." }),
  phoneNumber: z.string().regex(new RegExp("^[0-9]{10}$"), { message: "Phone Number Is Invalid!!" }),
  dateOfBirth: z.string().regex(new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}$"), { message: "Invalid Date" }),
})

export type FormItemType = {
  name: any
  label: string
  placeholder: string
  type: "text" | "date" | "email" | "tel";
}

export const PoliceStationInfo: FormItemType[] = [
  {
    name: "fullName" as "fullName",
    label: "Full Name",
    placeholder: "Enter Full Name...",
    type: "text",
  },
  {
    name: "profilePhoto" as "profilePhoto",
    label: "Profile Image",
    placeholder: "Enter Image URL...",
    type: "text",
  },
  {
    name: "dateOfBirth" as "dateOfBirth",
    label: "Date Of Birth",
    placeholder: "Enter Date Of Birth...",
    type: "date",
  },
  {
    name: "email" as "email",
    label: "Email",
    placeholder: "Enter Email...",
    type: "email",
  },
  {
    name: "phoneNumber" as "phoneNumber",
    label: "Phone Number",
    placeholder: "Enter Phone Number...",
    type: "tel",
  },
]

export const PoliceStationAddress: FormItemType[] = [
  {
    name: "address.district" as "address.district",
    label: "District",
    placeholder: "Enter District...",
    type: "text",
  },
  {
    name: "address.city" as "address.city",
    label: "City",
    placeholder: "Enter City...",
    type: "text",
  },
  {
    name: "address.state" as "address.state",
    label: "State",
    placeholder: "Enter State...",
    type: "text",
  },
  {
    name: "address.country" as "address.country",
    label: "Country",
    placeholder: "Enter Country...",
    type: "text",
  },
  {
    name: "address.pincode" as "address.pincode",
    label: "Pincode",
    placeholder: "Enter Pincode...",
    type: "text",
  },
]

type props = {
  state: State[]
}

// TODO: Add search for police officer

export const AppointBoard = ({ state }: props) => {

  const form = useForm<z.infer<typeof PoliceStationForm>>({
    resolver: zodResolver(PoliceStationForm),
    defaultValues: {
      fullName: "",
      address: {
        district: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      },
      profilePhoto: "",
      role: "Board",
      gender: "",
      email: "",
      phoneNumber: "",
    },
    mode: "onChange"
  })

  const onSubmit = (data: z.infer<typeof PoliceStationForm>) => {
    console.log(data)
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <PictureAndForm form={form} formItems={PoliceStationInfo} />
          {/* <div className="space-y-2 w-full">
            <CardTitle className="text-2xl">Police Station Address</CardTitle>
            <div className="flex flex-wrap items-center justify-between md:flex-row">
              <CardContent className="flex justify-between flex-wrap gap-2 px-0 sm:px-6 flex-1 order-2">
                {
                  PoliceStationAddress.map((field) => (
                    <FormField
                      key={field.name}
                      control={form.control}
                      name={field.name}
                      render={({ field: formField }) => (
                        <FormItem className={`min-w-full flex-1 md:min-w-[200px]`}>
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
              </CardContent>
            </div>
          </div> */}
          <div className="flex justify-center">
            <Button className="w-full sm:w-[50%] lg:w-[30%]" type="submit">Add Officer</Button>
          </div>
        </form>
      </Form>
      <AddAddressForm state={state} />
    </>
  )
}
