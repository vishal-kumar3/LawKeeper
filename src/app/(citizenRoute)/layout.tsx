import { Header } from "@/components/Header"
import { Toaster } from "@/components/ui/toaster"

type Children = {
    children: React.ReactNode
}

export default function CitizenLayout({ children }: Children) {

    return (
        <>
            <Header />
            {children}
            <Toaster />
        </>
    )
}