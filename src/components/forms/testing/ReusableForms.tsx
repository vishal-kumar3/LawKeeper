'use client'

import { useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export type FormItemType = {
  name: string
  label: string
  placeholder: string
  type: "text" | "date" | "email" | "tel" | "select" | "textarea"
  options?: { value: string; label: string }[]
  description?: string
}

type ReusableFormProps = {
  formSections: FormItemType[][]
  zodSchema: z.ZodObject<any>
  onSubmit: (data: any) => void
  title: string
  description: string
}

const PoliceStationInfo: FormItemType[] = [
  { name: "fullName", label: "Full Name", placeholder: "Enter Full Name...", type: "text" },
  { name: "profilePhoto", label: "Profile Image", placeholder: "Enter Image URL...", type: "text" },
  { name: "dateOfBirth", label: "Date Of Birth", placeholder: "Enter Date Of Birth...", type: "date" },
  { name: "email", label: "Email", placeholder: "Enter Email...", type: "email" },
  { name: "phoneNumber", label: "Phone Number", placeholder: "Enter Phone Number...", type: "tel" },
]

const PoliceStationAddress: FormItemType[] = [
  { name: "address.district", label: "District", placeholder: "Enter District...", type: "text" },
  { name: "address.city", label: "City", placeholder: "Enter City...", type: "text" },
  { name: "address.state", label: "State", placeholder: "Enter State...", type: "text" },
  { name: "address.pincode", label: "Pincode", placeholder: "Enter Pincode...", type: "text" },
]

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  profilePhoto: z.string().url("Must be a valid URL"),
  dateOfBirth: z.string(),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Must be a 10-digit number"),
  address: z.object({
    district: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string().regex(/^\d{6}$/, "Must be a 6-digit number"),
  }),
})

export function ReusableForm({ formSections, zodSchema, onSubmit, title, description }: ReusableFormProps) {
  const form = useForm<z.infer<typeof zodSchema>>({
    resolver: zodResolver(zodSchema),
    defaultValues: {},
    mode: 'onBlur',
  })

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {formSections.map((section, index) => (
              <div key={index} className="space-y-4">
                {section.map((item) => renderFormField(item, form))}
              </div>
            ))}
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default function Component() {

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data)
  }

  return (
    <div className="container mx-auto py-10">
      <ReusableForm
        formSections={[PoliceStationInfo, PoliceStationAddress]}
        zodSchema={formSchema}
        onSubmit={handleSubmit}
        title="Police Station Information"
        description="Please fill out the following information for the police station."
      />
    </div>
  )
}


export const renderFormField = (item: FormItemType, form: UseFormReturn<{
  [x: string]: any;
}, any, undefined>
) => {
  return (
    <FormField
      key={item.name}
      control={form.control}
      name={item.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{item.label}</FormLabel>
          <FormControl>
            {item.type === 'select' ? (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={item.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {item.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : item.type === 'textarea' ? (
              <Textarea placeholder={item.placeholder} {...field} />
            ) : (
              <Input type={item.type} placeholder={item.placeholder} {...field} />
            )}
          </FormControl>
          {item.description && <FormDescription>{item.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
