'use client'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { auth } from '@/auth'
import { signOut, useSession } from 'next-auth/react'






export const Navbar = () => {
    const {data: session} = useSession()
    const handleLogOutAction = () => {
        signOut()
    }
    console.log(session)

  return (
    <header className='bg-[#3795BD] sticky shadow-md top-0'>
        <nav className='flex h-16 justify-between items-center w-[92%] mx-auto'>
            <div>
                <Link href={'/'}><Image src={'/logo/Screenshot_84-removebg-preview.png'} width={130} height={10} alt='logo png'/></Link>
            </div>
            <div>
                <ul className='flex items-center gap-6'>
                    <li>
                        <Link className='hover:text-black hover:underline underline-offset-2 duration-300 text-white mb-1' href={"/about"}>About</Link>
                    </li>
                    <li>
                        <Link className='hover:text-black hover:underline underline-offset-2 duration-300 text-white mb-1' href={"/login"}>Contact</Link>
                    </li>
                    <li>
                        <Link className='hover:text-black hover:underline underline-offset-2 duration-300 text-white mb-1' href={"/squads"}>Squads</Link>
                    </li>
                    {session ? (<li><form action={handleLogOutAction}><button type='submit' className='hover:text-black hover:underline underline-offset-2 duration-300 text-white'>Logout</button></form></li>): (<li><Link className='hover:text-black hover:underline underline-offset-2 duration-300 text-white mb-1' href={"/login"}>Login</Link></li>)}
                    {session ? '': (<li><Link className='hover:text-black hover:underline underline-offset-2 duration-300 text-white mb-1' href={"/register"}>Register</Link></li>)}
                    
                    {session ? (<li><p className='hover:text-black hover:underline underline-offset-2 duration-300 text-white '>Hello, {session.user.name}</p></li>): ''}
                </ul>
            </div>
        </nav>
    </header>
  )
}
