
'use client'
import { login } from "@/actions/user";
import { loginSchema } from "@/schemas/loginSchema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Link from "next/link";
import { useFormState } from "react-dom";


export default function Home(){
  const [lastResult, action] = useFormState(login, undefined)
  const [form, fields] = useForm({
    lastResult,

    onValidate({formData}) {
      return parseWithZod(formData, {schema: loginSchema})
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: "onInput"
  })

  return(
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="w-96 bg-white p-8 rounded-md shadow-md border-2 border-[#7209b7]">
          <h1 className="text-center text-[#7209b7] text-2xl mb-3">Login</h1>
          <hr/>
          <form id={form.id} onSubmit={form.onSubmit} action={action}>
            <div className="mt-3">
              <label htmlFor="email" className="mb-2 block">Email</label>
              <input key={fields.email.key} name={fields.email.name} defaultValue={fields.email.initialValue} placeholder="example@example.com" className="border-2 w-full p-px shadow-md focus:outline-none focus:border-[#384B70] rounded-md"/>
              <p className="text-red-500 text-xs">{fields.email.errors}</p>
            </div>
            <div className="mt-3">
              <label htmlFor="Password" className="mb-2 block">Password</label>
              <input key={fields.password.key} name={fields.password.name} defaultValue={fields.password.initialValue} placeholder="*********" type="password" className="border-2 w-full p-px rounded-md shadow-md focus:outline-none focus:border-[#384B70]"/>
              <p className="text-red-500 text-xs">{fields.password.errors}</p>
            </div>
            <div className="mt-4">
              <Link href={'/forgot-password'} className="text-[#7209b7] hover:text-black duration-150 font-semibold">Forgot Password?</Link> 
            </div>
            <div className="mt-5">
              <button type="submit" className="border-2 text-white hover:-translate-y-1 active:translate-y-0 transform rounded-md px-2 py-1 duration-150 hover:bg-transparent hover:shadow-xl hover:text-black  bg-[#7209b7] w-full border-[#7209b7]">Login</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}