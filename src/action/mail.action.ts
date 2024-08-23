"use server"

import { transporter, mailOptions } from "@/utils/nodemailer"




export async function emailSender(formData: FormData){
  console.log("Sending mail")
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  try {
    await transporter.sendMail({
      ...mailOptions,
      subject: subject,
      text: message,
      html: `<h1>${message}</h1>`,
    })

    console.log("Done")
  } catch (error) {
    console.error("Error while sending mail:- ", error)
    return { error: "Error while sending mail"}
  }
}
