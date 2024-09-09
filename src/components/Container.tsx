import { twMerge } from "tailwind-merge";

type ContainerType = {
    children: any,
    className: string
}

export function Container(props: ContainerType) {
    return (
        <div className={twMerge("w-[100vw] h-[100vh] pt-[--header-height]", props.className)}>
            {props.children}
        </div>
    )
}