"use server"
import { signToken } from "@/auth"
import prisma from "@/prisma"
import bcryptjs from "bcryptjs"
import { cookies } from "next/headers"

export const createPoliceAccount = async () => {

  const hashedPassword = bcryptjs.hashSync("1234", 10)
  try {
    const policeAccount = await prisma.user.create({
      data: {
        password: hashedPassword,
        phoneNumber: "1111111111",
        fullName: "Police Officer",
        gender: "Male",
        role: "PoliceOfficer",
        policeOfficer: {
          create: {

          }
        }
      }
    })

    if (!policeAccount) return { error: "Error while creating Police Officer account" }

    const token = await signToken({
      id: policeAccount.id,
      name: policeAccount.fullName,
      role: "PoliceOfficer",
      verified: false
    })

    cookies().set("accessToken", token)

    return { success: "Police Officer Created" }
  }
  catch (err) {
    console.log(err)
    return { error: "Something went wrong!!!" }
  }
}
