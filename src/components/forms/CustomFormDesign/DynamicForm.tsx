"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { EyeIcon, EyeOffIcon, ImageIcon } from "lucide-react"

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
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

export type FieldDefinition = {
  name: string
  label: string
  type: "text" | "number" | "email" | "password" | "checkbox" | "radio" | "select" | "textarea" | "image"
  placeholder?: string
  description?: string
  options?: { label: string; value: string }[]
  customStyles?: {
    wrapper?: string
    label?: string
    input?: string
  }
}

type LayoutGroup = {
  fields: string[]
  customStyles?: {
    wrapper?: string
    fieldsWrapper?: string
  }
}

type DynamicFormProps = {
  schema: z.ZodObject<any>
  fields: FieldDefinition[]
  layout?: LayoutGroup[]
  onSubmit: (data: any) => void
  customStyles?: {
    form?: string
    submitButton?: string
  }
}

export default function DynamicForm({ schema, fields, layout, onSubmit, customStyles }: DynamicFormProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  })

  const [passwordVisibility, setPasswordVisibility] = useState<{ [key: string]: boolean }>({})
  const [imagePreview, setImagePreview] = useState<{ [key: string]: string }>({})

  const togglePasswordVisibility = (fieldName: string) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }))
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(prev => ({
          ...prev,
          [fieldName]: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
      form.setValue(fieldName, file)
    }
  }

  const renderField = (field: FieldDefinition) => {
    const commonClasses = `w-full ${field.customStyles?.input || ''}`

    switch (field.type) {
      case "text":
      case "number":
      case "email":
        return (
          <FormItem className={field.customStyles?.wrapper}>
            <FormLabel className={field.customStyles?.label}>{field.label}</FormLabel>
            <FormControl>
              <Input
                type={field.type}
                placeholder={field.placeholder}
                {...form.register(field.name)}
                className={commonClasses}
              />
            </FormControl>
            {field.description && <FormDescription>{field.description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      case "password":
        return (
          <FormItem className={field.customStyles?.wrapper}>
            <FormLabel className={field.customStyles?.label}>{field.label}</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={passwordVisibility[field.name] ? "text" : "password"}
                  placeholder={field.placeholder}
                  {...form.register(field.name)}
                  className={commonClasses}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility(field.name)}
                  aria-label={passwordVisibility[field.name] ? "Hide password" : "Show password"}
                >
                  {passwordVisibility[field.name] ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </FormControl>
            {field.description && <FormDescription>{field.description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      case "checkbox":
        return (
          <FormItem className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${field.customStyles?.wrapper}`}>
            <FormControl>
              <Checkbox {...form.register(field.name)} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className={field.customStyles?.label}>{field.label}</FormLabel>
              {field.description && <FormDescription>{field.description}</FormDescription>}
            </div>
          </FormItem>
        )
      case "radio":
        return (
          <FormItem className={`space-y-3 ${field.customStyles?.wrapper}`}>
            <FormLabel className={field.customStyles?.label}>{field.label}</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={(value) => form.setValue(field.name, value)} defaultValue={form.getValues(field.name)}>
                {field.options?.map((option) => (
                  <FormItem className="flex items-center space-x-3 space-y-0" key={option.value}>
                    <FormControl>
                      <RadioGroupItem value={option.value} />
                    </FormControl>
                    <FormLabel className="font-normal">{option.label}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            {field.description && <FormDescription>{field.description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      case "select":
        return (
          <FormItem className={field.customStyles?.wrapper}>
            <FormLabel className={field.customStyles?.label}>{field.label}</FormLabel>
            <Select onValueChange={(value) => form.setValue(field.name, value)} defaultValue={form.getValues(field.name)}>
              <FormControl>
                <SelectTrigger className={commonClasses}>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem value={option.value} key={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.description && <FormDescription>{field.description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      case "textarea":
        return (
          <FormItem className={field.customStyles?.wrapper}>
            <FormLabel className={field.customStyles?.label}>{field.label}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={field.placeholder}
                {...form.register(field.name)}
                className={commonClasses}
              />
            </FormControl>
            {field.description && <FormDescription>{field.description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      case "image":
        return (
          <FormItem className={field.customStyles?.wrapper}>
            <FormLabel className={field.customStyles?.label}>{field.label}</FormLabel>
            <FormControl>
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, field.name)}
                  className={`${commonClasses} hidden`}
                  id={`image-upload-${field.name}`}
                />
                <label
                  htmlFor={`image-upload-${field.name}`}
                  className="flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary"
                >
                  {imagePreview[field.name] ? (
                    <Image
                      src={imagePreview[field.name]}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById(`image-upload-${field.name}`)?.click()}
                >
                  Choose Image
                </Button>
              </div>
            </FormControl>
            {field.description && <FormDescription>{field.description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      default:
        return <FormItem>Unsupported field type</FormItem>
    }
  }

  const renderFields = () => {
    if (!layout) {
      return fields.map((field) => (
        <FormField
          key={field.name}
          control={form.control}
          name={field.name}
          render={({ field: formField }) => renderField({ ...field, ...formField })}
        />
      ))
    }

    return layout.map((group, index) => (
      <div key={index} className={group.customStyles?.wrapper}>
        <div className={group.customStyles?.fieldsWrapper}>
          {group.fields.map((fieldName) => {
            const field = fields.find((f) => f.name === fieldName)
            if (!field) return null
            return (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => renderField({ ...field, ...formField })}
              />
            )
          })}
        </div>
      </div>
    ))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={customStyles?.form}>
        {renderFields()}
        <Button type="submit" className={customStyles?.submitButton}>Submit</Button>
      </form>
    </Form>
  )
}
