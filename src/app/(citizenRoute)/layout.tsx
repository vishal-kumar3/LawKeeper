import { Header } from "@/components/Header"

type Children = {
    children: React.ReactNode
}

export default function CitizenLayout({ children }: Children) {

    return (
        <>
            <Header />
            {children}
        </>
    )
}