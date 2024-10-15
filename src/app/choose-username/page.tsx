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


export default function ChooseUsername(){

    const {data: session, status, update} = useSession();
    const [usernameToken, setUsernameToken] = useState('')
    const [loading, setLoading] = useState(false)
    const [choosingError, setChoosingError] = useState({
        state: false,
        message: ''
    })
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
            setChoosingError({
                state: true,
                message: data?.error
            })
        }
        if (data.result === "success") {
            await update({ name: usernameEntered })
                .then(() => {
                    router.push('/');
                })
                .catch((error) => {
                    setChoosingError({
                        state: true,
                        message: `Failed to update session: ${error.message}`
                    });
                });
        }
    }
    const [lastResult, action] = useFormState(chooseUsernameSubmit, {
        error: undefined,
      })
      const [form, fields] = useForm({
        lastResult,
    
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
    
    useEffect(() => {
        setTimeout(() => {
            if(choosingError.state){
                setChoosingError({
                    state: false,
                    message: ''
                })
            }
        }, 3000)
    }, [choosingError])

    return(
        <div className="flex justify-center items-center h-screen">
            <div className="w-[40rem] h-[18rem] p-8 shadow-md flex flex-col bg-white border-2 border-black rounded-md">
                <h1 className="text-center text-3xl">Choose Username</h1>
                <p className="text-center text-gray-800">Because you signed in with third-party app you have to choose username</p>
                {choosingError.state && <p className="text-center text-red-600">{choosingError.message}</p>}
                <form className="mt-2 flex flex-col items-center" action={action} id={form.id} onSubmit={form.onSubmit}>
                <label className="text-center mt-2 mb-2" htmlFor="username">Username</label>
                    <input
                        name={fields.username.name}
                        className="border-2 text-center border-black rounded-md mb-4 p-2"
                        style={{ maxWidth: '20rem', width: '100%' }}
                    />
                    
                    <button
                        type="submit"
                        className="border-2 border-black rounded-md text-center duration-300 p-2"
                        style={{ maxWidth: '10rem', width: '100%' }}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );

}