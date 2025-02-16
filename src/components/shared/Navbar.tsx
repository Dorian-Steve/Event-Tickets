import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import NavItems from './NavItems'
import Mobile from './Mobile'
import SearchBar from "@/components/shared/SearchBar";

const Navbar = () => {
  return (
    <div className='border-b'>
      <div className="flex flex-col lg:flex-row lg:gap-8 gap-3 p-3 item-center">
        <div className="flex items-center justify-between w-full lg:w-auto">
        <Link href='/' className='font-bold shrink-0'>
          <Image src='/assets/img/logo.svg' className='w-24 lg:w-28' alt='logo' width={100} height={100} />
        </Link>

        <div className="lg:hidden">
          <SignedIn>
            <UserButton/>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className='bg-gray-100 text-gray-800 px-3 py-1.5 text-sm 
              rounded-lg hover:bg-gray-200 translation border border-gray-200'>
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
        </div>
        </div>
          <div className="w-full lg:max-w-2xl">
            <SearchBar />
          </div>
          
          <div className="hidden justify-between lg:block ml-auto">
            <SignedIn>
              <div className="flex items-center gap-3">
                <Link href='/seller'>
                <button className="bg-purple-600 text-white px-3 py-1 5 text-sm rounded-lg hover:bg-purple-700 transition">
                  Sell Tickets
                </button>
                </Link>

                <Link href='/tickets'>
                <button className="bg-gray-100 text-gray-800 px-3 py-1 5 text-sm rounded-lg hover:bg-gray-200 transition border border-gray-300">
                  My Tickets
                </button>
                </Link>
                <UserButton />
              </div>
            </SignedIn>
            
            <SignedOut>
              <SignInButton mode='modal'>
              <button className="bg-gray-100 text-gray-800 px-3 py-1.5 test-sm rounded-lg hover:bg-gray-200 transition border border-gray-300 ">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div> 
          <div className="lg:hidden w-full flex justify-center gap-3">
            <SignedIn>
                <Link href='/seller' className='flex-1'>
                <button className="w-full bg-purple-500 text-white px-3 py-1 5 text-sm
                rounded-lg hover:bg-purple-700 transition">
                  Sell Tickets
                </button>
                </Link>

                <Link href='/tickets' className='flex-1'>
                <button className="w-full bg-gray-100 text-gray-800 px-3 py-1 5 text-sm 
                rounded-lg hover:bg-gray-200 transition border border-gray-300">
                  My Tickets
                </button>
                </Link> 
            </SignedIn>
            </div>
      </div>
    </div>
  )
}

export default Navbar
