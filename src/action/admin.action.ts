"use server"

import { AdminLoginSchema } from "@/components/forms/AdminLogin"
import prisma from "@/prisma"
import bcryptjs from "bcryptjs"

import { cookies } from "next/headers"
import { z } from "zod"
import { Gender, Role } from "@prisma/client"
import { signToken } from "@/auth"

export const adminLogin = async (data: z.infer<typeof AdminLoginSchema>, role: Role) => {

  const { phoneNumber, password } = data

  if (!phoneNumber || !password) return { error: "Please fill all the fields" }

  try {
    const admin = await prisma.user.findUnique({
      where: {
        phoneNumber: phoneNumber,
        role: role
      }
    })

    if (!admin) return { error: "No user found" }


    const isValidPassword = bcryptjs.compareSync(password, admin.password)

    if (!isValidPassword) return { error: "Wrong Password" }


    const token = await signToken({
      id: admin.id,
      name: admin.fullName,
      role: role,
      verified: false
    })

    cookies().set("accessToken", token)
    return { success: "Logged in" }
  }
  catch (err) {
    console.log(err)
    return { error: "Something went wrong!!!" }
  }
}

export type adminAccountProps = {
  data: {
    phoneNumber: string
    fullName: string
    gender: Gender
    password: string
  },
  role: Role
}

export const createAdminAccount = async ({ data, role }: adminAccountProps) => {

  const { phoneNumber, fullName, gender, password } = data

  if (!phoneNumber || !fullName || !gender || !password) return { error: "All fields are required" }

  const hashedPassword = bcryptjs.hashSync(password, 10)
  try {
    const admin = await prisma.user.create({
      data: {
        password: hashedPassword,
        phoneNumber: "0000000000",
        fullName: "Admin",
        gender: "Male",
        role: role,
      }
    })

    if (!admin) return { error: `Error while creating ${role} account` }

    const token = await signToken({
      id: admin.id,
      name: admin.fullName,
      role: role,
      verified: false
    })

    cookies().set("accessToken", token)

    return { success: `${fullName} with access of ${role} Created` }
  }
  catch (err) {
    console.log(err)
    return { error: "Something went wrong!!!" }
  }

}
