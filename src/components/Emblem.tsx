import { QuoteIcon } from "@radix-ui/react-icons";
import Image from "next/image";

export default function Emblem() {
    return (
        <div className="w-full md:w-[30vw] flex flex-col items-center justify-between gap-10 animate-appear-left">
            <Image src="/images/IndianEmblem.svg" width={204} height={44} alt="Indian Emblem" className="w-[20vw]" />
            <div className="hidden md:flex md:w-full xl:w-[25vw] relative text-center">
                <QuoteIcon className=" rotate-180 inline size-4" />
                <span className="font-medium text-lg italic inline">
                    Constitution is not a mere lawyer&apos;s document; it is a vehicle of life, and its spirit is always the spirit of age.
                </span>
                <QuoteIcon className="inline size-4" />
                <span className="font-bold text-lg absolute italic -bottom-10 right-0"> ~ BR Ambedkar</span>
            </div>
        </div>
    )
}
