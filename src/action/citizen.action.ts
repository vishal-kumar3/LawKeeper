'use server'

import { UserPayload, verifyAuth } from "@/auth";
import { cookies } from "next/headers";

export async function getUser() {
    try {
        const decodedToken: UserPayload | null = await verifyAuth(cookies().get("accessToken")?.value!)
        return decodedToken
    } catch (err) {
        console.log(err)
        return null
    }
}