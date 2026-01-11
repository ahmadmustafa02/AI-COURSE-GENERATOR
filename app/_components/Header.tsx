"use client"
import { Button } from '@/components/ui/button';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image'
import React from 'react'

const Header = () => {

  const {user} = useUser();
  return (
    <div  className='flex items-center justify-between p-4'>

        <div className='flex gap-2 items-center'>
            <Image src={'/logo.png'} alt='logo' width={45} height={45}/>
            <h2 className='text-xl font-bold'>VidCourse</h2>
        </div>
        <ul className='flex gap-8 items-center '>
            <li className='text-lg hover:text-primary font-medium cursor-pointer'>Home</li>
            <li className='text-lg hover:text-primary font-medium cursor-pointer'>Pricing</li>
        </ul>

    {  user ? 
        <UserButton/>:
        <SignInButton mode='modal'>
            <Button>Get Started </Button>
        </SignInButton>
    }
        


    </div>
  )
}

export default Header