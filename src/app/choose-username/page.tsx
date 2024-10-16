'use client'
import { db } from "@/src/db";
import { groupsTable, usersTable } from "@/src/db/schema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { eq } from "drizzle-orm";
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
import { useFormState } from "react-dom"
import { usernameSchema } from "@/schemas/usernameSchema";
import { handleErrorToast } from "@/src/toastFunctions";


export default function ChooseUsername(){

    const {data: session, status, update} = useSession();
    const [usernameToken, setUsernameToken] = useState('')
    const [loading, setLoading] = useState(false)
    const chooseUsernameSubmit = async (prevState: unknown, formData: FormData) => {
        const email = session?.user.email
        const usernameEntered = formData.get("username")
        
        const res = await fetch('/api/chooseUsername', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                email: email,
                username: usernameEntered,
                token: usernameToken
            })
        })
        const data = await res.json()
        if(data.error){
            handleErrorToast(data?.error)
        }
        if (data.result === "success") {
            await update({ name: usernameEntered })
                .then(() => {
                    router.push('/');
                })
                .catch((error) => {
                    handleErrorToast(`Failed to update session: ${error.message}`)
                });
        }
    }
    const [lastResult, action] = useFormState(chooseUsernameSubmit, undefined)
      const [form, fields] = useForm({
    
        onValidate({formData}) {
          return parseWithZod(formData, {schema: usernameSchema})
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: "onInput"
    })
    const router = useRouter()


    const getUserUsernameToken = async () => {
        setLoading(true)
        const email = session?.user.email
        const res = await fetch('/api/usernameToken', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                email: email
            })
        })
        const data = await res.json()
        const usernameToken = data.token
        if (usernameToken){
            console.log('token: ', usernameToken)
            setUsernameToken(usernameToken)
        } else {
            router.push('/')
        }
    }

    useEffect(() => {
        if (status === 'loading') return;
        if (!session){
            console.log("No session rediredting to 404")
            router.push('/Error.html')
        } else {
            getUserUsernameToken()
        }
    }, [status])
    

    return(
        <div className="flex justify-center items-center h-screen">
            <div className="w-[40rem] h-[18rem] p-8 shadow-md flex flex-col bg-white rounded-md">
                <h1 className="text-center text-3xl text-[#3795BD]">Choose Username</h1>
                <p className="text-center text-gray-800">Because you signed in with a third-party app, you have to choose a username</p>
                <form className="mt-2 flex flex-col items-center" action={action} id={form.id} onSubmit={form.onSubmit}>
                    <label className="text-center mt-2 mb-2 text-[#3795BD]" htmlFor="username">Username</label>
                    <input
                        name={fields.username.name}
                        className="border-2 text-center border-[#3795BD] rounded-md mb-4 p-2"
                        style={{ maxWidth: '20rem', width: '100%' }}
                    />
                    
                    <button
                        type="submit"
                        className="border-2 border-[#3795BD] rounded-md text-center duration-300 p-2 transform hover:-translate-y-1 bg-white text-[#3795BD] hover:bg-[#3795BD] hover:text-white"
                        style={{ maxWidth: '10rem', width: '100%' }}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );

}