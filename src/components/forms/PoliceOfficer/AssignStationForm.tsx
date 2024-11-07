"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCity, getDistrict } from "@/action/address.action"
import { AddressWithPoliceStation, City, District, State } from "@/types/address.types"
import { Input } from "@/components/ui/input"
import { getPoliceStationWithAddress, getPoliceStationWithPincode } from "@/action/station.action"
import { FormItemType } from "../AppointBoard"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"


export const AssignStationForm = ({ state }: { state: State[] }) => {
  const [stations, setStations] = React.useState<AddressWithPoliceStation[]>([]);

  return (
    <div className="space-y-5">
      <SelectStationForm state={state} setStation={setStations} />
      {
        stations.map((station) => {
          const details = [
            { label: "Station Head", value: station.policeStation?.SHOId || "not assigned yet" },
            { label: "Station Mail", value: station.policeStation?.stationMail || "not assigned yet" },
            { label: "Station Phone", value: station.policeStation?.stationPhone || "not assigned yet" },
            { label: "Department", value: "Add krna h" }
          ];

          return (
            <Card key={station.policeStation?.id}>
              <CardHeader>
                <CardTitle className="text-xl">{station.policeStation?.stationName}</CardTitle>
                <CardDescription>{station.address}, {station.district}, {station.city} {station.postalCode}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="w-[300px] h-[200px] bg-red-200"></div>
                <div className="text-lg">
                  {
                    details.map((detail, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Label className="text-lg">{detail.label}:</Label>
                        <span>{detail.value}</span>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          );
        })
      }
    </div>
  );
}



export type SelectFieldProps<T> = {
  data: string[]
  field: keyof T
  label: string
  formItem?: FormItemType
  formControl?: any
  reset: boolean
  onSelect: (value: T[keyof T] | string) => void
}

export const SelectField = <T extends object>({
  data,
  field,
  label,
  reset,
  formItem,
  formControl,
  onSelect,
}: SelectFieldProps<T>) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [inputText, setInputText] = React.useState("")

  React.useEffect(() => {
    if (reset) {
      console.log("reset hua")
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

export function SelectStationForm({ state, setStation }: { state: State[], setStation: (value: any) => void }) {
  const [selectedState, setSelectedState] = React.useState("")
  const [selectedCity, setSelectedCity] = React.useState("")
  const [selectedDistrict, setSelectedDistrict] = React.useState("")
  const [district, setDistrict] = React.useState<District[]>([])
  const [city, setCity] = React.useState<City[]>([])
  const [pincode, setPincode] = React.useState("")

  const [resetAll, setResetAll] = React.useState(false)
  const [resetCity, setResetCity] = React.useState(false)
  const [resetDistrict, setResetDistrict] = React.useState(false)

  React.useEffect(() => {
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

  React.useEffect(() => {
    async function searchCity() {
      const district = await getDistrict(selectedState, selectedCity)
      setDistrict(district)
    }

    if (selectedCity) {
      setResetCity(false)
      searchCity()
    }

    if (selectedCity === "") {
      setResetCity(true)
      setDistrict([])
    }
  }, [selectedCity])

  React.useEffect(() => {
    async function searchStation() {
      const PoliceStation = await getPoliceStationWithAddress(selectedState, selectedCity, selectedDistrict)
      console.log(PoliceStation)
      setStation(PoliceStation)
    }

    if (selectedDistrict === "") {
      setResetDistrict(true)
      return;
    }

    searchStation()
    setPincode("")
  }, [selectedDistrict])

  const stationUsingPincode = async () => {
    if (pincode.length != 6) return;
    const PoliceStation = await getPoliceStationWithPincode(pincode)
    setResetAll(true)
    setStation(PoliceStation)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Police Station</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-8 flex-wrap lg:flex-nowrap justify-between items-center md:px-16">
        <SelectField
          data={state}
          field="state"
          label="State"
          reset={resetAll}
          onSelect={setSelectedState}
        />
        <SelectField
          data={city}
          field="city"
          label="City"
          reset={resetCity || resetAll}
          onSelect={setSelectedCity}
        />
        <SelectField
          data={district}
          field="district"
          label="District"
          reset={resetDistrict || resetCity || resetAll}
          onSelect={setSelectedDistrict}
        />
        {/* Add more SelectField components for zone, postalCode, district, etc. */}
      </CardContent>

      <div className="mx-auto w-fit mb-4">or</div>

      <CardContent className="flex gap-3 items-center md:px-16">
        <Label>Pin Code</Label>
        <Input value={pincode} onChange={(e) => {
          // allow only numbers and no space
          setPincode(e.target.value.replace(/[^0-9]/g, ""))
        }} maxLength={6} minLength={6} type="text" className="flex-1" placeholder="Enter Pin Code..." />
        <Button onClick={stationUsingPincode} type="submit" disabled={pincode.length != 6} className="disabled:opacity-50 disabled:cursor-not-allowed" >Search</Button>
      </CardContent>
    </Card>
  )
}
