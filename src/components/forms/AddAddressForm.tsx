"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { City, District, Pincode, State } from "@/types/address.types"
import { SelectField } from "./PoliceOfficer/AssignStationForm"
import { useEffect, useState } from "react"
import { getCity, getDistrict, getPincode } from "@/action/address.acton"

export function AddAddressForm({ state }: { state: State[]}) {
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedPincode, setSelectedPincode] = useState("")

  const [district, setDistrict] = useState<District[]>([])
  const [city, setCity] = useState<City[]>([])
  const [pincode, setPincode] = useState<Pincode[]>([])

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
        <SelectField
          data={pincode}
          field="postalCode"
          label="Pincode"
          reset={resetDistrict || resetCity || resetAll}
          onSelect={setSelectedPincode}
        />
      </CardContent>
    </Card>
  )
}
