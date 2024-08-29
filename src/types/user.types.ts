import { Prisma } from "@prisma/client";


export type User = Prisma.UserGetPayload<{}> | null

export type UserWithImage = Prisma.UserGetPayload<{
  include: {
    profilePhoto: true
  }
}> | null
