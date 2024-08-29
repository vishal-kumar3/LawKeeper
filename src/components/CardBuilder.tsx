import { Separator } from "@radix-ui/react-separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"

type CardProps = {
    title: string,
    description?: string,
    content: React.JSX.Element,
    footer: React.JSX.Element
}

export function CardBuilder(props: CardProps) {

    const { title, description, content, footer } = props

    return (
        <Card className="w-[25vw] h-[40vh] flex flex-col items-start justify-between hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-4">
                {content}
            </CardContent>
            <CardFooter>
                {footer}
            </CardFooter>
        </Card>
    )
}
