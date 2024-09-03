"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Container } from "@/components/Container";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Loading from "@/components/loader";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { CldUploadButton, CldImage } from 'next-cloudinary';
import { deleteImage } from "@/action/cloudinary.action";


const formSchema = z.object({
    fullName: z.string().min(1),
    email: z.string(),
    phoneNumber: z.string(),
    gender: z.enum(["Male", "Female"]),
    dateOfBirth: z.string(),
    address: z.array(z.object({
        id: z.string(),
        country: z.string(),
        state: z.string(),
        city: z.string(),
        postalCode: z.string().regex(/^[0-9]*$/, { message: "Invalid Postal Code" }),
        street: z.string().nullable(),
        landmark: z.string().nullable(),
        houseNumber: z.string().nullable(),
        district: z.string().nullable()
    })),
    userDocuments: z.object({
        voterIdNumber: z.string().regex(/(^[A-Z]{3}[0-9]{7}$)|^$/, { message: "Invalid Voter ID Number" }).nullable(),
        aadharCardNumber: z.string().regex(/(^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$)|^$/, { message: "Invalid Aadhar Card Number" }).nullable(),
        panCardNumber: z.string().regex(/([A-Z]{5}[0-9]{4}[A-Z]{1})|^$/, { message: "Invalid Pan Card Number" }).nullable(),
        passportNumber: z.string().regex(/(^[A-Z][1-9]\d\s?\d{4}[1-9]$)|^$/, { message: "Invalid Passport Number" }).nullable(),
        drivingLicenceNumber: z.string().regex(/(^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$)|^$/, { message: "Invalid Driving License Number" }).nullable(),
    })
})


type InputFieldProps = {
    control: any
    name: string,
    label: string,
    description?: string,
    options?: any
}

type MyImage = {
    public_id: string
}

type DividerProps = {
    label: string
}

type DocumentsPhotos = {
    voterIdPhoto: MyImage | null,
    aadharCardPhoto: MyImage | null,
    panCardPhoto: MyImage | null,
    passportPhoto: MyImage | null,
    drivingLicencePhoto: MyImage | null,
    profilePhoto: MyImage | null
}

enum Doc {
    voterIdPhoto = "voterIdPhoto",
    aadharCardPhoto = "aadharCardPhoto",
    panCardPhoto = "panCardPhoto",
    passportPhoto = "passportPhoto",
    drivingLicencePhoto = "drivingLicencePhoto",
    profilePhoto = "profilePhoto"
}

type PhotoFieldProps = {
    image: MyImage | null,
    onDocumentUpload: (data: any) => {},
    label: string,
    preset?: string
}

function InputField(props: InputFieldProps) {

    const { control, label, description, name, options } = props

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input {...options} {...field} />
                    </FormControl>
                    <FormDescription>
                        {description}
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

function Divider(props: DividerProps) {
    return (
        <div className="w-full flex items-center justify-start gap-2">
            <span className=" w-fit text-gray-400 text-sm uppercase font-medium">{props.label}</span>
            <div className=" flex-grow h-[2px] bg-gray-300 rounded-full"></div>
        </div>
    )
}

function PhotoField(props: PhotoFieldProps) {
    return (
        <div className="w-full flex flex-col items-start justify-between">
            <div className="ml-4 text-sm font-medium">{props.label}</div>
            <div className="flex items-end pb-2 justify-start gap-4 text-sm w-full">
                <div className="text-sm self-center text-gray-500">{props.image?.public_id && "Uploaded"}</div>
                <CldUploadButton className="bg-primary text-primary-foreground w-[40%] py-2 rounded text-sm" uploadPreset={props.preset || "myPreset"} onSuccess={props.onDocumentUpload} />
            </div>
        </div>
    )
}

export default function Profile() {


    const [loader, setLoader] = useState(true)
    const [isSameAddress, setIsSameAddress] = useState(false)
    const router = useRouter()
    const { toast } = useToast()
    const [imagesState, setImagesState] = useState<DocumentsPhotos>({
        voterIdPhoto: null,
        aadharCardPhoto: null,
        panCardPhoto: null,
        passportPhoto: null,
        drivingLicencePhoto: null,
        profilePhoto: null
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {

            if (data.dateOfBirth !== "") {
                data.dateOfBirth = new Date(data.dateOfBirth).toISOString()
            }

            let formData: any = {
                ...data,
                profilePhoto: imagesState.profilePhoto,
                userDocuments: {
                    ...data.userDocuments,
                }
            }

            formData.userDocuments.voterIdPhoto = imagesState.voterIdPhoto?.public_id
            formData.userDocuments.aadharCardPhoto = imagesState.aadharCardPhoto?.public_id
            formData.userDocuments.panCardPhoto = imagesState.panCardPhoto?.public_id
            formData.userDocuments.passportPhoto = imagesState.passportPhoto?.public_id
            formData.userDocuments.drivingLicencePhoto = imagesState.drivingLicencePhoto?.public_id

            console.log(formData)

            const response = await axios.post("/api/v1/users/citizens", formData)
            console.log(response)

            router.push("/")

            toast({
                title: "Profile Updated Successfully"
            })
        } catch (err) {
            console.log(err)
        }
    }

    const fetchUserData = async () => {
        try {
            const { data } = await axios.get("/api/v1/users")
            const userData = data.data

            userData.dateOfBirth = userData.dateOfBirth?.slice(0, 10)
            console.log(userData)
            if (userData.profilePhoto) {
                setImagesState((prev) => ({
                    ...prev,
                    "profilePhoto": { public_id: userData.profilePhoto?.public_id },
                    "aadharCardPhoto": { public_id: userData.userDocuments.aadharCardPhoto },
                    "voterIdPhoto": { public_id: userData.userDocuments.voterIdPhoto },
                    "panCardPhoto": { public_id: userData.userDocuments.panCardPhoto },
                    "passportPhoto": { public_id: userData.userDocuments.passportPhoto },
                    "drivingLicencePhoto": { public_id: userData.userDocuments.drivingLicencePhoto },
                }))
            }

            return userData
        } catch (err) {
            console.log(err)
        } finally {
            setLoader(false)
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: async () => await fetchUserData(),
        mode: "onChange"
    })

    const handleSameAddress = () => {
        if (!isSameAddress) {
            const idOfFirst = form.getValues("address.1.id")
            form.setValue("address.1", form.getValues("address.0"))
            form.setValue("address.1.id", idOfFirst)
        }
        setIsSameAddress(!isSameAddress)
    }

    const onDocumentUpload = async (data: any, doc: Doc) => {

        // Deleting previously uploaded file
        if (imagesState?.[doc]) {
            const response = await deleteImage(imagesState[doc].public_id)
            console.log(response)
            setImagesState((prev) => ({ ...prev, doc: { public_id: "" } }))
        }

        setImagesState((prev) => ({ ...prev, [doc]: { public_id: data.info.public_id } }))
    }

    useEffect(() => {
        if (isSameAddress) {
            const idOfFirst = form.getValues("address.1.id")
            form.setValue("address.1", form.getValues("address.0"))
            form.setValue("address.1.id", idOfFirst)
        }
    }, [form.formState, isSameAddress])

    return (
        !loader &&
        <Container>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[70%] mx-auto py-10">

                    <Divider label="Personal Details" />

                    <div className="w-full flex items-center justify-between">
                        <div className="w-[50%]">
                            <InputField
                                name="fullName"
                                label="Full Name"
                                control={form.control}
                            />

                            <InputField
                                name="email"
                                label="Email"
                                control={form.control}
                                options={{ disabled: true }}
                            />

                            <InputField
                                name="phoneNumber"
                                label="Phone Number"
                                control={form.control}
                                options={{ disabled: true }}
                            />

                            <div className="w-full flex items-center justify-between">
                                <InputField
                                    name="dateOfBirth"
                                    label="Date Of Birth"
                                    control={form.control}
                                    options={{ type: "date" }}
                                />
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <FormControl>
                                                <RadioGroup {...field} className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Male" id="option-one" />
                                                        <Label htmlFor="option-one">Male</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Female" id="option-two" />
                                                        <Label htmlFor="option-two">Female</Label>
                                                    </div>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                        </div>

                        {/* TODO: Profile photo part */}
                        <div className=" flex-grow h-full flex flex-col items-center justify-center gap-4">
                            <CldImage src={imagesState.profilePhoto?.public_id || "https://res.cloudinary.com/dn7tgdikq/image/upload/v1724999624/LawKeeper/ghb4flnfqwgk3fyd6zv2.png"} className="rounded-full object-cover w-[200px] h-[200px]" width={200} height={200} alt="" />

                            <CldUploadButton className="bg-primary text-primary-foreground w-[40%] py-2 rounded text-sm" uploadPreset="myPreset" onSuccess={(results) => onDocumentUpload(results, Doc.profilePhoto)} />
                            <Button type="button" variant={"destructive"} className="w-[40%]" onClick={() => setImagesState((prev) => ({...prev, "profilePhoto": {public_id: ""}}))}>Remove Picture</Button>
                        </div>
                    </div>

                    <Divider label="Current Address" />

                    <div className="grid grid-cols-2 gap-x-5">
                        <InputField
                            name="address.0.country"
                            control={form.control}
                            label="Country"
                        />
                        <InputField
                            name="address.0.state"
                            control={form.control}
                            label="State"
                        />
                        <InputField
                            name="address.0.city"
                            control={form.control}
                            label="City"
                        />
                        <InputField
                            name="address.0.postalCode"
                            control={form.control}
                            label="Postal Code"
                        />
                        <InputField
                            name="address.0.landmark"
                            control={form.control}
                            label="Landmark"
                        />
                        <InputField
                            name="address.0.street"
                            control={form.control}
                            label="Street"
                        />
                        <InputField
                            name="address.0.houseNumber"
                            control={form.control}
                            label="House Number"
                        />
                    </div>

                    <Divider label="Permanent Address" />

                    <div className="flex items-center justify-start gap-2">
                        <Checkbox id="cb" onClick={handleSameAddress} />
                        <Label htmlFor="cb" className="text-sm" >Same as Current Address</Label>
                    </div>

                    <div className="grid grid-cols-2 gap-x-5">
                        <InputField
                            name="address.1.country"
                            control={form.control}
                            label="Country"
                            options={{ disabled: isSameAddress }}
                        />
                        <InputField
                            name="address.1.state"
                            control={form.control}
                            label="State"
                            options={{ disabled: isSameAddress }}
                        />
                        <InputField
                            name="address.1.city"
                            control={form.control}
                            label="City"
                            options={{ disabled: isSameAddress }}
                        />
                        <InputField
                            name="address.1.postalCode"
                            control={form.control}
                            label="Postal Code"
                            options={{ disabled: isSameAddress }}
                        />
                        <InputField
                            name="address.1.landmark"
                            control={form.control}
                            label="Landmark"
                            options={{ disabled: isSameAddress }}
                        />
                        <InputField
                            name="address.1.street"
                            control={form.control}
                            label="Street"
                            options={{ disabled: isSameAddress }}
                        />
                        <InputField
                            name="address.1.houseNumber"
                            control={form.control}
                            label="House Number"
                            options={{ disabled: isSameAddress }}
                        />
                    </div>

                    <Divider label="Documents" />

                    <div className="grid grid-cols-2 gap-x-5">
                        <InputField
                            name="userDocuments.voterIdNumber"
                            control={form.control}
                            label="Voter Id Number"
                        />
                        <PhotoField
                            image={imagesState.voterIdPhoto}
                            onDocumentUpload={(results) => onDocumentUpload(results, Doc.voterIdPhoto)}
                            label="Voter ID Photo"
                            preset="documentsPreset"
                        />
                        <InputField
                            name="userDocuments.aadharCardNumber"
                            control={form.control}
                            label="Aadhar Card Number"

                        />
                        <PhotoField
                            image={imagesState.aadharCardPhoto}
                            onDocumentUpload={(results) => onDocumentUpload(results, Doc.aadharCardPhoto)}
                            label="Aadhar Card Photo"
                            preset="documentsPreset"
                        />
                        <InputField
                            name="userDocuments.panCardNumber"
                            control={form.control}
                            label="Pan Card Number"
                        />
                        <PhotoField
                            image={imagesState.panCardPhoto}
                            onDocumentUpload={(results) => onDocumentUpload(results, Doc.panCardPhoto)}
                            label="Pan Card Photo"
                            preset="documentsPreset"
                        />
                        <InputField
                            name="userDocuments.passportNumber"
                            control={form.control}
                            label="Passport Number"
                        />
                        <PhotoField
                            image={imagesState.passportPhoto}
                            onDocumentUpload={(results) => onDocumentUpload(results, Doc.passportPhoto)}
                            label="Passport Photo"
                            preset="documentsPreset"
                        />
                        <InputField
                            name="userDocuments.drivingLicenceNumber"
                            control={form.control}
                            label="Driving License Number"
                        />
                        <PhotoField
                            image={imagesState.drivingLicencePhoto}
                            onDocumentUpload={(results) => onDocumentUpload(results, Doc.drivingLicencePhoto)}
                            label="Driving License Photo"
                            preset="documentsPreset"
                        />
                    </div>

                    <Button className="w-32 h-10 text-sm font-semibold tracking-wide" disabled={!form.formState.isValid || form.formState.isSubmitting} type="submit">
                        {
                            form.formState.isSubmitting ?
                                <Loading />
                                : "Update"
                        }
                    </Button>
                </form>
            </Form>
        </Container>
    )
}