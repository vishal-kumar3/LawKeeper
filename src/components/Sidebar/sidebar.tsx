import Link from 'next/link'
import React from 'react'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import Image from 'next/image'

type props = {}

const Sidebar = (props: props) => {
  return (
    <div className='h-screen space-y-10 p-5 px-2 xl:px-8 sticky top-0 left-0 overflow-hidden sm:w-[80px] lg:w-full border-r rounded-r-3xl shadow-lg'>
      <div className='w-fit mx-auto'>
        <Image src="/images/IndianEmblem.svg" className='mx-auto' alt='emblem' width={40} height={40} />
        <div className='hidden xl:flex h-fit w-fit mx-auto text-xl'>Law Keeper</div>
      </div>
      <div className='flex flex-col space-y-1'>
        <SidebarButton />
        <SidebarLink />
        <ThemeToggle />
      </div>
    </div>
  )
}

export const SidebarButton = () => {
  return (
    <button className='transition-all ease-in-out lg:hover:shadow-primary/60 lg:hover:shadow-lg w-fit lg:w-full h-9 px-4 py-6 text-lg flex gap-2 items-center rounded-xl lg:hover:bg-primary/50'>
      <div className='size-9 hover:shadow-lg p-2 bg-red-300' ></div>
      <div className='invisible lg:visible'>
        Button
      </div>
    </button>
  )
}

export const SidebarLink = () => {
  return (
    <Link href="/" className='transition-all ease-in-out lg:hover:shadow-primary/60 lg:hover:shadow-lg w-fit lg:w-full h-9 px-4 py-6 text-lg flex gap-2 items-center rounded-xl lg:hover:bg-primary/50'>
      <div className='size-9 hover:shadow-lg p-2 bg-red-300' ></div>
      <div className='invisible lg:visible'>
        Profile
      </div>
    </Link>
  )
}

export default Sidebar
