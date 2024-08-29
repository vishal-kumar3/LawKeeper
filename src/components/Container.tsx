import { twMerge } from "tailwind-merge";


export function Container({children, className = ""}: any) {
    return (
        <div className={twMerge("w-[100vw] h-[100vh] pt-[--header-height]", className)}>
            {children}
        </div>
    )
}