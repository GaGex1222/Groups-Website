'use client'
import Link from 'next/link'
import React, { useEffect } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { signOut } from "next-auth/react"
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation'




export const Navbar = () => {
    const {data: session, status} = useSession();
    const router = useRouter()
    
    useEffect(() => {
        if(session) {
            console.log("Session updated:", session);
            router.refresh()
        }
    }, [session]);
    if (status === "loading"){
        return (
        <div className='text-center h-16 bg-[#7209b7]'><CircularProgress/></div>
        );
    }
  return (
    <header className='bg-[#7209b7] sticky shadow-lg top-0'>
        <nav className='flex h-16 justify-between items-center w-[92%] mx-auto'>
            <div>
                <Link href={'/'}><Image src={'/logo/Screenshot_84-removebg-preview.png'} width={130} height={10} alt='logo png'/></Link>
            </div>
            <div>
                <ul className='flex items-center gap-6'>
                    <li>
                        <Link className='hover:text-black duration-300 text-white mb-1' href={"/about"}>About</Link>
                    </li>
                    <li>
                        <Link className='hover:text-black duration-300 text-white mb-1' href={"/login"}>Contact</Link>
                    </li>
                    <li>
                        <Link className='hover:text-black duration-300 text-white mb-1' href={"/login"}>Groups</Link>
                    </li>
                    {session ? (<li><button className='hover:text-black duration-300 text-white' onClick={signOut}>Logout</button></li>): (<li><Link className='hover:text-black duration-300 text-white mb-1' href={"/login"}>Login</Link></li>)}
                    {session ? '': (<li><Link className='hover:text-black duration-300 text-white mb-1' href={"/register"}>Register</Link></li>)}
                    
                    {session ? (<li><p className='hover:text-black duration-300 text-white '>Hello, {session.user?.username}</p></li>): ''}
                </ul>
            </div>
        </nav>
    </header>
  )
}
