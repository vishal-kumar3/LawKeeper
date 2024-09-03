"use server"

import prisma from "@/prisma"
import { AddressWithPoliceStation } from "@/types/address.types"
import { Station } from "@/types/station.types"

export const getPoliceStationWithAddress = async (selectedState: string, selectedCity: string, selectedDistrict: string) => {
  const policeStation: AddressWithPoliceStation[] = await prisma.address.findMany({
    where: {
      state: selectedState,
      city: selectedCity,
      district: selectedDistrict,
    },
    include: {
      policeStation: true,
    },
  }).catch((error) => {
    console.error(error)
    return []
  })

  return policeStation
}

export const getPoliceStationWithPincode = async (postalCode: string) => {
  const policeStation = await prisma.address.findMany({
    where: {
      postalCode,
    },
    include: {
      policeStation: true,
    },
  }).catch((error) => {
    console.error(error)
    return []
  })
  console.log(policeStation)
  return policeStation
}
