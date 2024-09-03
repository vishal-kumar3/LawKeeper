"use server"

import prisma from "@/prisma"
import { City, District, Pincode, State } from "@/types/address.types"

export const getState = async () => {
  const state: State[] = await prisma.address.findMany({
    distinct: ['state'],
    select: {
      state: true,
    },
  }).catch((error) => {
    console.error(error)
    return []
  })

  return state
}

export const getCity = async (selectedState: string) => {
  const city: City[] = await prisma.address.findMany({
    where: {
      state: selectedState,
    },
    distinct: ['city'],
    select: {
      city: true,
    },
  }).catch((error) => {
    console.error(error)
    return []
  })

  return city
}

export const getDistrict = async (selectedState: string, selectedCity: string) => {
  const district: District[] = await prisma.address.findMany({
    where: {
      state: selectedState,
      city: selectedCity,
    },
    distinct: ['district'],
    select: {
      district: true,
    },
  }).catch((error) => {
    console.error(error)
    return []
  })

  return district
}

export const getPincode = async (selectedState: string, selectedCity: string, selectedDistrict: string) => {
  const pincode: Pincode[] = await prisma.address.findMany({
    where: {
      state: selectedState,
      city: selectedCity,
      district: selectedDistrict,
    },
    distinct: ['postalCode'],
    select: {
      postalCode: true,
    },
  }).catch((error) => {
    console.error(error)
    return []
  })

  return pincode
}
