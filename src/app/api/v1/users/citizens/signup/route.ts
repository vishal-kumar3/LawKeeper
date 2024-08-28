import { NextRequest } from "next/server";
import prisma from "@/prisma";
import bcryptjs from "bcryptjs"
import { CustomResponse } from "@/helpers/CustomResponse";
import { asyncHandler } from "@/helpers/asyncHandler";
import { cookies } from "next/headers";
import { signToken } from "@/auth";

export const POST = asyncHandler(async (req: NextRequest) => {

  const body = await req.json()
  const { fullName, email, phoneNumber, password, gender } = body

  if ([fullName, email, phoneNumber, password, gender].some(field => field == ''))
    return CustomResponse(
      400,
      "Invalid Input",
      {},
      { title: "Required fields are missing", description: "Please fill all the required fields" }
    )

  if (phoneNumber.length != 10)
    return CustomResponse(
      400,
      "Invalid Input",
      {},
      { title: "Not a valid phone number", description: "Please give the valid phone number" }
    )

  if (gender != 'Male' && gender != 'Female')
    return CustomResponse(
      400,
      "Invalid Input",
      {},
      { title: "Not a valid gender", description: "Please give the valid gender" }
    )

  if (!(email.match("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")?.length))
    return CustomResponse(
      400,
      "Invalid Input",
      {},
      { title: "Not a valid email", description: "Please give the valid email" }
    )

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: email
        },
        {
          phoneNumber: phoneNumber
        }
      ]
    }
  })

  if (user)
    return CustomResponse(
      401,
      "User already exists",
      {},
      { title: "User already exists", description: "Please login" }
    )

  const hashedPassword = bcryptjs.hashSync(password)

  const newUser = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      gender,
      phoneNumber,
      role: "Citizen",
    },
  })

  const connectUserToCitizen = await prisma.citizen.create({
    data: {
      userId: newUser.id
    }
  })

  newUser.password = ""
  const token = await signToken({
    id: newUser.id,
    name: newUser.fullName,
    role: newUser.role,
    verified: false
  })

  cookies().set("accessToken", token)

  return CustomResponse(
    201,
    "User created successfully",
    { newUser }
  )

})
