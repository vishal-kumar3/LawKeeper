import { NextRequest } from "next/server";
import prisma from "@/prisma";
import { CustomResponse } from "@/helpers/CustomResponse";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { asyncHandler } from "@/helpers/asyncHandler";
import { cookies } from "next/headers";
import { citizenTokenSign } from "@/utils/auth";

export const POST = asyncHandler(async (req: NextRequest) => {

  const body = await req.json()
  const { phoneNumber, password } = body

  if (!phoneNumber || !password)
    return CustomResponse(
      400,
      "Some fields are missing",
      {},
      {
        title: "Required fields are missing",
        description: "Please fill all the required fields"
      }
    )

  const user = await prisma.user.findUnique({
    where: {
      phoneNumber: phoneNumber
    }
  })

  if (!user)
    return CustomResponse(
      404,
      "No user found",
      {},
      { title: "No user found", description: "Please signup" }
    )

  const isValidPassword = bcryptjs.compareSync(password, user.password)
  if (!isValidPassword)
    return CustomResponse(
      403,
      "Wrong password",
      {},
      { title: "Wrong Password", description: "Please enter the correct password" }
    )

  user.password = ""
  const token = await citizenTokenSign({
    id: user.id,
    email: user.email,
  })

  cookies().set("accessToken", token)

  return CustomResponse(
    200,
    "User logged in successfully",
    { user }
  )

})
