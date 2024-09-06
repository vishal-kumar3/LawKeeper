'use server'

import { auth, UserPayload, verifyAuth } from "@/auth";
import prisma from "@/prisma";
import { User, UserWithImage } from "@/types/user.types";
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

export const getCurrentUser = async () => {
  try{
    const session: UserPayload | null = await verifyAuth(cookies().get("accessToken")?.value!)
    if(!session) return null

    const currentUser: UserWithImage = await prisma.user.findUnique({
      where: {
        id: session.id,
        role: "Citizen",
      },
      include: {
        profilePhoto: true
      }
    })

    if(!currentUser) return null

    return currentUser
  }
  catch(err){
    console.error(err)
  }
}


export const logoutUser = async () => {
  try {
    cookies().delete("accessToken")
    return true
  } catch (err) {
    return err
  }
}