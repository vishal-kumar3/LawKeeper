import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import Link from 'next/link'

export type CardProps = {
  title: string
  description: string
  link: string
}

type props = {
  title: string
  card: CardProps[]
}

const AppointOfficersCard = ({title, card}: props) => {
  return (
    <div className="py-5">
      <CardHeader>
        <CardTitle className="text-2xl">{title || "" }</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-10 lg:justify-start justify-center items-center">
          {
            card?.map((item, index) => (
              <Link href={item.link} key={index} className="min-w-full sm:min-w-[400px]">
                <Card>
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))
          }
        </div>
      </CardContent>
    </div>
  )
}

export default AppointOfficersCard
