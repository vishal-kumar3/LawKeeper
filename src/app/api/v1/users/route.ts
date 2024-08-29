import { UserPayload, verifyAuth } from "@/auth";
import { asyncHandler } from "@/helpers/asyncHandler";
import { CustomResponse } from "@/helpers/CustomResponse";
import prisma from "@/prisma";
import { NextRequest } from "next/server";


export const GET = asyncHandler(async (req: NextRequest) => {

    const token = req.cookies.get("accessToken")?.value
    if(!token) return CustomResponse(403, "No active session found", {}, {})

  const decodedToken: UserPayload | null = await verifyAuth(token)
  if (!decodedToken) return CustomResponse(403, "No user found", {}, {})

    const user = await prisma.user.findUnique({
        where: {
            id: decodedToken.id
        },
        include: {
            address: true,
            userDocuments: true,
            Image: true
        }
    })

    if(!user) return CustomResponse(403, "No user found", {}, {})

    return CustomResponse(200, "Fetched", {...user})

})
