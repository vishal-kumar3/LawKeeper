"use server"

import { Role } from "@prisma/client"
import { cookies } from "next/headers"
import { jwtVerify, SignJWT, jwtDecrypt } from 'jose'
import { nanoid } from 'nanoid'
import { JwtPayload } from "jsonwebtoken"

/**
 * UserPayload :- Custom JwtPayload
 */
export interface UserPayload extends JwtPayload {
  id: string
  name: string
  role: Role
  verified?: boolean
}

export const getJwtSecretkey = async (): Promise<Uint8Array> => {
  const secret = process.env.JWT_SECRET_KEY

  if (!secret || secret.length === 0) {
    throw new Error("The environment variable JWT_SECRET_KEY is empty!!!")
  }

  return await new TextEncoder().encode(secret)
}

export const verifyAuth = async (token: string): Promise<UserPayload | null> => {
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, await getJwtSecretkey())
    return payload as UserPayload
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

export const signToken = async (payload: UserPayload): Promise<string> => {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setJti(nanoid())
    .setExpirationTime('10d')
    .sign(await getJwtSecretkey())

  return token
}

export const decryptToken = async (token: string): Promise<UserPayload | null> => {
  try {
    const { payload } = await jwtDecrypt(token, await getJwtSecretkey())
    return payload as UserPayload
  } catch (error) {
    console.error("Token decryption error:", error)
    return null
  }
}

export const setCookie = (token: string) => {
  cookies().set("accessToken", token, { path: '/', secure: true, httpOnly: true })
  console.log("Cookie 'accessToken' is set!")
}

export const getToken = (): string | undefined => {
  const token = cookies().get("accessToken")?.value
  return token
}

export const auth = async (): Promise<UserPayload | null> => {
  const token = getToken()
  if (!token) return null

  const session = await verifyAuth(token)
  return session
}
