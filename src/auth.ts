"use server"

import { Role } from "@prisma/client"
import jwt, { JwtPayload } from "jsonwebtoken"
import { cookies } from "next/headers"
import { jwtVerify, SignJWT, jwtDecrypt } from 'jose'
import {nanoid} from 'nanoid'
/**
  * UserPayload :- Custom JwtPayload
*/
export interface UserPayload extends JwtPayload {
  id: string
  name: string
  role: Role
  verified?: boolean
  exp?: number
}

export const getJwtSecretkey = () => {
  const secret = process.env.JWT_SECRET_KEY

  if(!secret || secret.length === 0){
    throw new Error("The environment variable JWT_SECRET_KEY is empty!!!")
  }

  return secret
}

export const verifyAuth = async (token: string) => {
  try{
    const verified = await jwtVerify<UserPayload>(token, new TextEncoder().encode(getJwtSecretkey()))
    // console.log(verified.payload)
    return verified.payload as UserPayload
  } catch (error){
    console.log(error)
    return null
  }
}

export const signToken = async (payload: UserPayload) => {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg : 'HS256'})
    .setIssuedAt()
    .setJti(nanoid())
    .setExpirationTime('10d')
    .sign(new TextEncoder().encode(getJwtSecretkey()))

  return token
}

export const decryptToken = async (token: string) => {
  const { payload } = await jwtDecrypt<UserPayload>(token, new TextEncoder().encode(getJwtSecretkey()))
  if(!payload) return null
  return payload
}

export const setCookie = ( token: string ) => {
  cookies().set("accessToken", token)
  console.log("Cookie testToken is active!!!")
}

export const getToken = (): string | undefined => {
  const token = cookies().get("accessToken")?.value
  return token;
}

export const auth = async () => {
  const token = await getToken();
  if(!token) return null
  
  const session: UserPayload | null = await verifyAuth(token);
  console.log("token", session)
  return session
}

