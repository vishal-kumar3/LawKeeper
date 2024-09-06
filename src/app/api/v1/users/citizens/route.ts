import { UserPayload, verifyAuth } from "@/auth";
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


export const POST = asyncHandler(async (req: NextRequest) => {

    const body = await req.json()
    console.log(body)
    const token = req.cookies.get("accessToken")?.value
    if (!token) return CustomResponse(403, "No active session found", {}, {})

    const decodedToken: UserPayload | null = await verifyAuth(token)
    if (!decodedToken) return CustomResponse(403, "No user found", {}, {})

    const address = body?.address
    const { fullName, gender, dateOfBirth, profilePhoto, userDocuments } = body

    // Updating Current Address
    await prisma.address.update({
        where: {
            id: address[0].id,
        },
        data: address[0]
    })

    // Updating Permanent Address
    await prisma.address.update({
        where: {
            id: address[1].id
        },
        data: address[1]
    })


    if (profilePhoto) {
        await prisma.image.upsert({
            where: {
                userId: decodedToken.id
            },
            create: {
                url: profilePhoto.url,
                public_id: profilePhoto.public_id,
                userId: decodedToken.id,
            },
            update: {
                url: profilePhoto.url,
                public_id: profilePhoto.public_id,
            }
        })
    }

    // Updates user and it can throw RecordNotFound Exception
    await prisma.user.update({
        where: {
            id: decodedToken.id
        },
        include: {
            address: true
        },
        data: {
            fullName,
            gender,
            dateOfBirth
        }
    })

    await prisma.userDocuments.update({
        where: {
            userId: decodedToken.id
        },
        data: {
            ...userDocuments
        }
    })

    return CustomResponse(200, "Updated")

})