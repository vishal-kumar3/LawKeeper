import { asyncHandler } from "@/helpers/asyncHandler";
import { CustomResponse } from "@/helpers/CustomResponse";
import prisma from "@/prisma";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken"


export const GET = asyncHandler(async (req: NextRequest) => {

    const token = req.cookies.get("accessToken")?.value
    if(!token) return CustomResponse(403, "No active session found", {}, {})

    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY!)
    
    const user = await prisma.user.findFirst({
        where: {
            id: {
                equals: decodedToken.id
            }
        }
    })

    if(!user) return CustomResponse(403, "No user found", {}, {})

    return CustomResponse(200, "Fetched", {...user})

})