import { Prisma } from "@prisma/client";


export type User = Prisma.UserGetPayload<{}> | null

export type UserWithImage = Prisma.UserGetPayload<{
  include: {
    profilePhoto: true
  }
}> | null


export type PoliceStationFull = Prisma.PoliceStationGetPayload<{
  include: {
    location: true,
    officers: {
      include: {
        user: true
      }
    },
    SHO: {
      include: {
        user: true
      }
    },
    stationImage: true
  }
}> | null