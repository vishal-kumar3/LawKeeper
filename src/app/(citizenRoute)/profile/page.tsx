"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Container } from "@/components/Container";
import { Input } from "@/components/ui/input";
import { User } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
    fullName: z.string().min(1),
    email: z.string(),
    phoneNumber: z.string(),
    profilePhoto: z.string(),
    gender: z.enum(["Male", "Female"]),
    dateOfBirth: z.string(),
    address: z.array(z.object({
        country: z.string(),
        state: z.string(),
        city: z.string(),
        postalCode: z.string(),
        street: z.string(),
        landmark: z.string(),
        houseNumber: z.string(),
    })),
    userDocuments: z.object({
        voterIdNumber: z.string(),
        voterIdPhoto: z.string(),
        aadharCardNumber: z.string(),
        aadharCardPhoto: z.string(),
        panCardNumber: z.string(),
        panCardPhoto: z.string(),
        passportNumber: z.string(),
        passportPhoto: z.string(),
        drivingLicenceNumber: z.string(),
        drivingLicencePhoto: z.string(),
    })
})


type InputFieldProps = {
    control: any
    name: string,
    label: string,
    description?: string,
    options?: any
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

type DividerProps = {
    label: string
}

function Divider(props: DividerProps) {
    return (
        <div className="w-full flex items-center justify-start gap-2">
            <span className=" w-fit text-gray-400 text-sm uppercase font-medium">{props.label}</span>
            <div className=" flex-grow h-[2px] bg-gray-300 rounded-full"></div>
        </div>
    )
}

function createDefaultDocuments() {
    return {
        voterIdNumber: "",
        voterIdPhoto: "",
        aadharCardNumber: "",
        aadharCardPhoto: "",
        panCardNumber: "",
        panCardPhoto: "",
        passportNumber: "",
        passportPhoto: "",
        drivingLicenceNumber: "",
        drivingLicencePhoto: ""
    }
}

function createDefaultAddress() {
    const address = {
        country: '',
        state: '',
        city: '',
        postalCode: '',
        street: '',
        landmark: '',
        houseNumber: ''
    }

    return [address, address]
}

export default function Profile() {

    const [user, setUser] = useState<User>()
    const [loader, setLoader] = useState(true)

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log("data is")
        console.log(data)
    }

    const fetchUserData = async () => {
        try {
            const { data } = await axios.get("/api/v1/users")
            const userData = data.data

            if (userData.address.length === 0) {
                userData.address = createDefaultAddress()
            }

            if (userData.userDocuments === null) {
                userData.userDocuments = createDefaultDocuments()
            }

            Object.keys(userData).map(key => {
                if (userData[key] === null || userData[key] === undefined) {
                    userData[key] = ''
                }
            })


            console.log(userData)
            setUser(userData)
            return userData
        } catch (err) {
            console.log(err)
        } finally {
            setLoader(false)
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: async () => await fetchUserData()
    })


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
                            <Image src={"/images/noProfile.png"} className="rounded-full object-cover" width={200} height={200} alt="" />
                            <Button className="w-[40%]">Upload New Picture</Button>
                            <Button variant={"destructive"} className="w-[40%]">Remove Picture</Button>
                        </div>
                    </div>

                    <Divider label="Permament Address" />

                    <div className="grid grid-cols-2 gap-x-5">
                        <InputField
                            name="address[0].country"
                            control={form.control}
                            label="Country"
                        />
                        <InputField
                            name="address[0].state"
                            control={form.control}
                            label="State"
                        />
                        <InputField
                            name="address[0].city"
                            control={form.control}
                            label="City"
                        />
                        <InputField
                            name="address[0].postalCode"
                            control={form.control}
                            label="Postal Code"
                        />
                        <InputField
                            name="address[0].landmark"
                            control={form.control}
                            label="Landmark"
                        />
                        <InputField
                            name="address[0].street"
                            control={form.control}
                            label="Street"
                        />
                        <InputField
                            name="address[0].houseNumber"
                            control={form.control}
                            label="House Number"
                        />
                    </div>

                    <Divider label="Current Address" />

                    <div className="flex items-center justify-start gap-2">
                        <Checkbox id="cb" />
                        <Label htmlFor="cb" className="text-sm" >Same as Permanent Address</Label>
                    </div>

                    <div className="grid grid-cols-2 gap-x-5">
                        <InputField
                            name="address[1].country"
                            control={form.control}
                            label="Country"
                        />
                        <InputField
                            name="address[1].state"
                            control={form.control}
                            label="State"
                        />
                        <InputField
                            name="address[1].city"
                            control={form.control}
                            label="City"
                        />
                        <InputField
                            name="address[1].postalCode"
                            control={form.control}
                            label="Postal Code"
                        />
                        <InputField
                            name="address[1].landmark"
                            control={form.control}
                            label="Landmark"
                        />
                        <InputField
                            name="address[1].street"
                            control={form.control}
                            label="Street"
                        />
                        <InputField
                            name="address[1].houseNumber"
                            control={form.control}
                            label="House Number"
                        />
                    </div>

                    <Divider label="Documents" />

                    <div className="grid grid-cols-2 gap-x-5">
                        <InputField
                            name="userDocuments.voterIdNumber"
                            control={form.control}
                            label="Voter Id Number"
                        />
                        <InputField
                            name="userDocuments.voterIdPhoto"
                            control={form.control}
                            label="Voter Id Photo"
                            options={{ type: "file", className: "w-fit" }}
                        />
                        <InputField
                            name="userDocuments.aadharCardNumber"
                            control={form.control}
                            label="Aadhar Card Number"
                        />
                        <InputField
                            name="userDocuments.aadharCardPhoto"
                            control={form.control}
                            label="Aadhar Card Photo"
                            options={{ type: "file", className: "w-fit" }}
                        />
                        <InputField
                            name="userDocuments.panCardNumber"
                            control={form.control}
                            label="Pan Card Number"
                        />
                        <InputField
                            name="userDocuments.panCardPhoto"
                            control={form.control}
                            label="Pan Card Photo"
                            options={{ type: "file", className: "w-fit" }}
                        />
                        <InputField
                            name="userDocuments.passportNumber"
                            control={form.control}
                            label="Passport Number"
                        />
                        <InputField
                            name="userDocuments.passportPhoto"
                            control={form.control}
                            label="Passport Photo"
                            options={{ type: "file", className: "w-fit" }}
                        />
                        <InputField
                            name="userDocuments.drivingLicenceNumber"
                            control={form.control}
                            label="Driving License Number"
                        />
                        <InputField
                            name="userDocuments.drivingLicencePhoto"
                            control={form.control}
                            label="Driving License Photo"
                            options={{ type: "file", className: "w-fit" }}
                        />
                    </div>

                    <Button type="submit">Update</Button>
                </form>
            </Form>
        </Container>
    )
}