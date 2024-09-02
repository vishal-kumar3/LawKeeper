'use server'

import { v2 } from "cloudinary"

// Configuration
v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



export const deleteImage = async (public_id: string) => {
    try {
        const response = await v2.uploader.destroy(public_id)
        return response
    } catch (err) {
        console.log(err)
        return null
    }
}