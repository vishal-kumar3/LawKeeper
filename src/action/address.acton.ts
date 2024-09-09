"use server"

import prisma from "@/prisma"
import { City, District, Pincode, State } from "@/types/address.types"

export const getState = async (mode?: boolean) => {
  const state: State[] = await prisma.address.findMany({
    distinct: ['state'],
    select: {
      state: true,
    },
  }).catch((error) => {
    console.error(error)
    return []
  })

  return state.map(s => s.state)
}

export const getCity = async (selectedState: string, mode?: boolean) => {
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


  return city.map(s => s.city)
}

export const getDistrict = async (selectedState: string, selectedCity: string, mode?: boolean) => {
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

  return district.map(s => s.district)
}

export const getPincode = async (selectedState: string, selectedCity: string, selectedDistrict: string, mode?: boolean) => {
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

  return pincode.map(s => s.postalCode)
}
