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
import { CardContent, CardTitle } from "../../ui/card"


const PoliceStationForm = z.object({
  stationName: z.string().min(1, { message: "Station Name must be at least 1 character." }),
  address: z.object({
    district: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    pincode: z.string().regex(new RegExp("^[0-9]{7}$"), { message: "Invalid Pincode" }),
  }),
  // TODO: Add department enum may be???
  // department: z.enum(["Cyber Crime", " "], { message: "Get Some Brain!!!" }),
  stationImage: z.string().url({ message: "Invalid URL" }),
  stationHead: z.string(),
  stationMail: z.string().email({ message: "Invalid email address." }),
  stationPhone: z.string().regex(new RegExp("^[0-9]{10}$"), { message: "Phone Number Is Invalid!!" }),
})

const PoliceStationInfo = [
  {
    name: "stationName" as "stationName",
    label: "Station Name",
    placeholder: "Enter Station Name...",
    type: "text",
  },
  {
    name: "stationImage" as "stationImage",
    label: "Station Image",
    placeholder: "Enter Image URL...",
    type: "text",
  },
  {
    name: "stationHead" as "stationHead",
    label: "Station Head",
    placeholder: "Enter Station Head...",
    type: "text",
  },
  {
    name: "stationMail" as "stationMail",
    label: "Station Mail",
    placeholder: "Enter Station Mail...",
    type: "email",
  },
  {
    name: "stationPhone" as "stationPhone",
    label: "Station Phone",
    placeholder: "Enter Station Phone...",
    type: "tel",
  },
]

const PoliceStationAddress = [
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

type props = {}

// TODO: Add search for police officer

const AddPoliceStation = (props: props) => {

  const form = useForm<z.infer<typeof PoliceStationForm>>({
    resolver: zodResolver(PoliceStationForm),
    defaultValues: {
      stationName: "",
      address: {
        district: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      },
      stationImage: "",
      stationHead: "",
      stationMail: "",
      stationPhone: "",
    },
    mode: "onChange"
  })

  const onSubmit = (data: z.infer<typeof PoliceStationForm>) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8"
      >
        <div className="space-y-2">
          <CardTitle className="text-2xl">Police Station Details</CardTitle>
          <div className="flex flex-col h-fit items-center md:flex-row ">
            <CardContent className="w-full px-0 sm:px-6 flex-1 order-2 space-y-6">
              {
                PoliceStationInfo.map((field) => (
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
            </CardContent>
            <div className="bg-red-300 order-1 w-[500px] h-[350px]">
              {/* <Image src={"/images/pic1.jpg"} width={400} height={500} alt="image" className="aspect-4/5 " /> */}
            </div>
          </div>
        </div>
        <div className="space-y-2 w-full">
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
        </div>
        <div>

        </div>
        <div className="flex justify-center">
          <Button className="w-full sm:w-[50%] lg:w-[30%]" type="submit">Add Officer</Button>
        </div>
      </form>
    </Form>
  )
}

export default AddPoliceStation
