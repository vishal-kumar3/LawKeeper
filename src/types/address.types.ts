import { Prisma } from "@prisma/client";


export type Address = Prisma.AddressGetPayload<{}> | null

export type State = Prisma.AddressGetPayload<{
  select : {
    state: true,
  }
}>

export type City = Prisma.AddressGetPayload<{
  select : {
    city: true
  }
}>

export type District = Prisma.AddressGetPayload<{
  select: {
    district: true
  }
}>

export type AddressWithPoliceStation = Prisma.AddressGetPayload<{
  include: {
    policeStation: true
  }
}>
