import { NextRequest } from "next/server";
import prisma from "@/prisma";
import { CustomResponse } from "@/helpers/CustomResponse";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { asyncHandler } from "@/helpers/asyncHandler";
import { cookies } from "next/headers";

export const POST = asyncHandler(async (req: NextRequest) => {

    const body = await req.json()
    const { emailOrPhoneNumber, password } = body

    if (!emailOrPhoneNumber || !password)
        return CustomResponse(
            400,
            "Some fields are missing",
            {},
            { title: "Required fields are missing", description: "Please fill all the required fields" }
        )

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    email: {
                        equals: emailOrPhoneNumber
                    }
                },
                {
                    phoneNumber: {
                        equals: emailOrPhoneNumber
                    }
                }
            ]
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
    const token = jwt.sign({
        id: user.id,
        email: user.email
    },
        process.env.JWT_SECRET_KEY!,
        {
            expiresIn: "10d"
        }
    )

    cookies().set("accessToken", token)

    return CustomResponse(
        200,
        "User logged in successfully",
        { user }
    )

})