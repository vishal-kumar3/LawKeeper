import { asyncHandler } from "@/helpers/asyncHandler";
import prisma from "@/prisma";
import { Address, Gender, Image, Rank, UserDocuments } from "@prisma/client";
import { NextRequest } from "next/server";
import bcryptjs from "bcryptjs"
import { CustomResponse } from "@/helpers/CustomResponse";

// TODO: Optimize it and add error handling

type FormData = {
    userDetails: {
        password: string,
        email: string | undefined,
        fullName: string,
        phoneNumber: string,
        gender: Gender,
        dateOfBirth: Date
    }
    profilePhoto: Image | undefined,
    userDocuments: UserDocuments | undefined,
    address: Address | undefined,
    officerDetails: {
        badgeNumber: string,
        rank?: Rank,
        assignedStationId: string
    }
}

export const POST = asyncHandler(async (req: NextRequest) => {

    const data: FormData = await req.json()

    const hashedPassword = bcryptjs.hashSync(data.userDetails.password)

    // Creating User
    const user = await prisma.user.create({
        data: {
            ...data.userDetails,
            role: 'PoliceOfficer',
            password: hashedPassword,
            emailVerified: new Date().toISOString()
        }
    })

    // Connecting user to profilePhoto
    if(data.profilePhoto)
        await prisma.image.create({
            data: {
                ...data.profilePhoto,
                userId: user.id
            }
        })

    // Connecting user to User Documents
    await prisma.userDocuments.create({
        data: {
            ...data.userDocuments,
            userId: user.id,
            isVerified: true
        }
    })

    // Connecting user to Address
    await prisma.address.create({
        data: {
            ...data.address,
            userId: user.id
        }
    })

    // Connecting user to Police Officer
    await prisma.policeOfficer.create({
        data: {
            ...data.officerDetails,
            userId: user.id
        }
    })

    return CustomResponse(201, "Created Successfully", {})

})