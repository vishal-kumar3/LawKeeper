import { NextResponse } from "next/server";

export function CustomResponse(status: number = 200, message: string = "success", data: any = {}, error: any = null, config: any = []) {
    if(!error) return NextResponse.json({message, data, success: true}, {status, ...config})
    return NextResponse.json({message, error, success: false}, {status})
}