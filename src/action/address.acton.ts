"use server"

import prisma from "@/prisma"

export const getState = async () => {
  const state = await prisma.address.findMany({
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
  const city = await prisma.address.findMany({
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
  const district = await prisma.address.findMany({
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

