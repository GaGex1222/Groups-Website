'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage(){
    const {data: session, status} = useSession();
    const router = useRouter();
    if (session) {
        router.push("/")
    }
    return(
        <div className="w-full h-screen flex">
            <div className="w-6/12">
            
            </div>
            <div className="w-8/12">

            </div>
        </div>
    );
}