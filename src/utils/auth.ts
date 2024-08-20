"use server"
import jwt from 'jsonwebtoken';


export const citizenTokenSign = async(signData: any) => {
  const token = await jwt.sign({
    role: "citizen",
    ...signData
  },
  process.env.JWT_SECRET_KEY!,
  {
    expiresIn: "10d"
  }
  )

  return token
}


export const decodeToken = (token: string) => {
  return jwt.decode(token)
}
