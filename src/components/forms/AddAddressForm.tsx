"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { City, District, Pincode, State } from "@/types/address.types"
import { SelectField } from "./PoliceOfficer/AssignStationForm"
import { useEffect, useState } from "react"
import { getCity, getDistrict, getPincode } from "@/action/address.acton"
import { cn } from "@/lib/utils"
import { FormItemType } from "./AppointBoard"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Label } from "../ui/label"
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"

export function AddAddressForm({ state, className, formItem, form }: { state: string[], className?: string, formItem?: FormItemType[], form:any}) {
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedPincode, setSelectedPincode] = useState("")

  const [district, setDistrict] = useState<string[]>([])
  const [city, setCity] = useState<string[]>([])
  const [pincode, setPincode] = useState<string[]>([])

  const [resetAll, setResetAll] = useState(false)
  const [resetCity, setResetCity] = useState(false)
  const [resetDistrict, setResetDistrict] = useState(false)

  useEffect(() => {
    async function searchCity() {
      const city = await getCity(selectedState)
      setCity(city)
    }

    if (selectedState) {
      setResetAll(false)
      searchCity()
    }

    if (selectedState === "") {
      console.log("reset")
      setResetAll(true)
      setCity([])
    }
  }, [selectedState])

  useEffect(() => {
    async function searchDistrict() {
      const district = await getDistrict(selectedState, selectedCity)
      setDistrict(district)
    }

    if (selectedCity) {
      setResetCity(false)
      searchDistrict()
    }

    if (selectedCity === "") {
      setResetCity(true)
      setDistrict([])
    }
  }, [selectedCity])

  useEffect(() => {
    async function searchPincode() {
      const pincode = await getPincode(selectedState, selectedCity, selectedDistrict)
      setPincode(pincode)
    }

    if (selectedDistrict) {
      setResetDistrict(false)
      searchPincode()
    }

    if (selectedDistrict === "") {
      setResetDistrict(true)
      setPincode([])
    }
  }, [selectedDistrict])

  useEffect(() => {

    if (selectedPincode) {
      setResetDistrict(false)
    }

    if (selectedPincode === "") {
      setResetDistrict(true)
      setPincode([])
    }

  }, [selectedPincode])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Search Police Station</CardTitle>
      </CardHeader>
      <CardContent className={cn("flex gap-8 flex-wrap lg:flex-nowrap justify-between items-center md:px-16", className)}>
        <SelectField
          data={state}
          field="state"
          label="State"
          formItem={formItem && formItem[2]}
          formControl={form && form.control}
          reset={resetAll}
          onSelect={setSelectedState}
        />
        <SelectField
          data={city}
          field="city"
          label="City"
          formItem={formItem && formItem[1]}
          formControl={form && form.control}
          reset={resetCity || resetAll}
          onSelect={setSelectedCity}
        />
        <SelectField
          data={district}
          field="district"
          label="District"
          formItem={formItem && formItem[0]}
          formControl={form && form.control}
          reset={resetDistrict || resetCity || resetAll}
          onSelect={setSelectedDistrict}
        />
        <SelectField
          data={pincode}
          field="postalCode"
          label="Pincode"
          formItem={formItem && formItem[3]}
          formControl={form && form.control}
          reset={resetDistrict || resetCity || resetAll}
          onSelect={setSelectedPincode}
        />
      </CardContent>
    </Card>
  )
}

export type selectAddressProps = {
  data: any
  field: any
  label: string
  formItem?: FormItemType
  formControl?: any
  reset: boolean
  onSelect: (value:  any) => void
}

export const SelectAddress = ({
  data,
  field,
  label,
  reset,
  formItem,
  formControl,
  onSelect,
}: selectAddressProps) => {

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [inputText, setInputText] = useState("")

  useEffect(() => {
    if (reset) {
      setValue("")
      setOpen(false)
    }
  }, [reset])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex w-full gap-5 items-center">
          <Label className="w-[50px]">{label}</Label>
          {
            formItem && formControl && (
              <FormItem>
                <FormControl>
                  <FormField
                    control={formControl}
                    name={formItem?.name}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={formItem.type}
                        value={value}
                        onChange={(e) => {
                          setInputText(e.target.value)
                        }}
                        placeholder={`Select ${label}...`}
                        className="flex-1 min-w-[200px]"
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex-1 min-w-[200px] justify-between"
          >
            {value ? String(value) : `Select ${label}...`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={String(item[field])}
                  value={String(item[field])}
                  onSelect={(currentValue) => {
                    const selectedValue = currentValue === value ? "" : item[field]
                    setValue(selectedValue as string)
                    onSelect(selectedValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item[field] ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {String(item[field])}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
