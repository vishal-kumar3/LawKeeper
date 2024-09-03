import React from 'react'
import { CardContent, CardTitle } from '../ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { FormItemType } from './AppointBoard'

type props = {
  form: any
  formItems: FormItemType[]
}

const PictureAndForm = ({form, formItems}: props) => {
  return (
    <div className="space-y-2">
      <CardTitle className="text-2xl">State Board Member Details</CardTitle>
      <div className="flex flex-col h-fit items-center md:flex-row ">
        <CardContent className="w-full px-0 sm:px-6 flex-1 order-2 space-y-6">
          {
            formItems.map((field: FormItemType) => (
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
        <div className="bg-red-300 order-1 w-[500px] h-[350px]">
          {/* <Image src={"/images/pic1.jpg"} width={400} height={500} alt="image" className="aspect-4/5 " /> */}
        </div>
      </div>
    </div>
  )
}

export default PictureAndForm
