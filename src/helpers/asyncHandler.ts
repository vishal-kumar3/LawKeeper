import { NextRequest } from "next/server"
import { CustomResponse } from "./CustomResponse"

export const asyncHandler = (fn: any) => async (req: NextRequest) => {
        try {
            return await fn(req)
        } catch (error) {
            console.log(error)
            return CustomResponse(500, "Server Error", {}, error)
        }
    }