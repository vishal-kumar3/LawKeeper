import React from 'react'

type props = {
  children: React.ReactNode
  title: string
  description: string
}

const Dashboard = ({ children, title, description }: props) => {
  return (
    <div>
      <div className="border-b">
        <p className="text-4xl text-center md:text-start font-semibold">{title}</p>
        <p className="opacity-50 text-center md:text-start mt-1 mb-6">
          {description}
        </p>
      </div>
      <div className='py-5'>
        {children}
      </div>
    </div>
  )
}

export default Dashboard
