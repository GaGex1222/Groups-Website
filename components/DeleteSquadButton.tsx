import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {handleErrorToast, handleSuccesToast} from "@/src/toastFunctions"
import { useRouter } from "next/navigation";



export default function DeleteSquadButton(props: any){
    const {data: session} = useSession()
    const router = useRouter()



    const handleDeleteSquad = async () => {
        const userId = session?.user.userId

        const squadId = props.squadId
        try{
            const res = await fetch('/api/deleteSquad', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    userId: userId,
                    squadId: squadId
                })
            })
            console.log(res.ok)
            if(res.ok){
                handleSuccesToast('Squad deleted successfully!')
                router.push('/squads')
            } else {
                const errorData = await res.json();
                handleErrorToast(errorData.message || 'An unexpected error occurred.')
            }
        } catch (error){
            console.log("Error occured when deleting squad", error)
        }
    }


    return(
        <>
            <button onClick={handleDeleteSquad} className="rounded-md shadow-sm border-2 border-red-500 mt-2 text-white bg-red-500 p-2 hover:bg-[#3795BD] duration-300 hover:border-[#3795BD] transform hover:-translate-y-1">Delete Squad</button>
        </>
    )
}