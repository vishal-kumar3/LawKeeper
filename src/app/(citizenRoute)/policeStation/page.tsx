"use client"

import { getStationByStationId } from "@/action/station.action"
import { Container } from "@/components/Container"
import Loading from "@/components/loader"
import { PoliceStationFull } from "@/types/user.types"
import { PoliceOfficer } from "@prisma/client"
import { LocateFixed, LocateIcon, Mail, PhoneCall } from "lucide-react"
import { CldImage } from "next-cloudinary"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function PoliceStation() {

    const stationId = useSearchParams().get("stationId") || ""
    const [station, setStation] = useState<PoliceStationFull | null>(null)
    const [loading, setLoading] = useState(false)

    const fetchStation = async () => {
        try {
            setLoading(true)
            const response = await getStationByStationId(stationId)
            setStation(response)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStation()
    }, [])

    return (
        !loading ?
            <Container className=" flex flex-col items-center justify-start gap-4">
                <h1 className="text-2xl uppercase font-bold italic pt-10">{station?.stationName}</h1>
                <div className="w-full grid grid-cols-4 justify-items-center gap-y-2 text-gray-600 text-sm">
                    <span className="w-fit flex items-center justify-start gap-2"><Mail /><p>{station?.stationMail || "No mail ID"}</p></span>
                    <span className="w-fit flex items-center justify-start gap-2"><PhoneCall /><p>{station?.stationPhone}</p></span>
                    <span className="w-fit flex items-center justify-start gap-2"><LocateIcon /><p>{station?.location?.address}</p></span>
                    <span className="w-fit flex items-center justify-start gap-2"><LocateFixed /><p>{station?.location?.postalCode}</p></span>
                    {/* </div> */}
                    {/* <div className="w-full flex flex-row items-center justify-evenly text-gray-600 text-sm"> */}
                    {station?.departments.map((department, index) => <div key={index}>
                        {department}
                    </div>)}
                    {/* </div> */}
                    {/* <div className="w-full flex flex-row items-center justify-evenly text-gray-600 text-sm"> */}
                    <span className="w-fit flex items-center justify-start gap-2">SHO: {station?.SHO?.user.fullName || "NA"}</span>
                    <span className="w-fit flex items-center justify-start gap-2">{station?.location?.city}</span>
                    <span className="w-fit flex items-center justify-start gap-2">{station?.location?.state}</span>
                    <span className="w-fit flex items-center justify-start gap-2">{station?.location?.district}</span>
                    {/* </div> */}
                </div>
                <CldImage src={station?.stationImage?.public_id || ""} className={station?.stationImage?.public_id ? "block" : "hidden"} width={400} height={200} alt="" />
                <div>
                    {station?.officers.map((officer, index) => <div key={index}>
                        {officer.user.fullName}
                    </div>)}
                </div>
            </Container>
            : <Loading className=" flex items-center justify-center w-[100vw] h-[100vh]" />
    )
}