import { asyncHandler } from "@/helpers/asyncHandler";
import { CustomResponse } from "@/helpers/CustomResponse";
import prisma from "@/prisma";
import { NextRequest } from "next/server";

export const GET = asyncHandler(async (req: NextRequest) => {

    const email = req.nextUrl.searchParams.get("email") || ""
    const phoneNumber = req.nextUrl.searchParams.get("phoneNumber") || ""

    const response = {
        email: true,
        phoneNumber: true
    }

    if (email != "") {
        const user = await prisma.user.findFirst({
            where: {
                email: {
                    startsWith: email
                }
            }
        })

        if (user) response.email = false
    }

    if (phoneNumber && phoneNumber.length == 10) {
        const user = await prisma.user.findFirst({
            where: {
                phoneNumber: {
                    equals: phoneNumber
                }
            }
        })

        if (user) response.phoneNumber = false
    }

    return CustomResponse(
        200,
        "Fetched successfully",
        { ...response }
    )

})