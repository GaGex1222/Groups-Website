
'use client'
import { login } from "@/actions/user";
import { loginSchema } from "@/schemas/loginSchema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import GithubSigninButton from "@/components/GithhubSigninButton";
import GoogleSignInButton from "@/components/GoogleSignInButton";


export default function Home(){
  const router = useRouter();
  const [lastResult, action] = useFormState(login, {
    error: undefined,
  })
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
        <div className="w-96 bg-white p-8 rounded-md shadow-md border-2 border-[#3795BD] focus:">
          <h1 className="text-center text-[#3795BD] text-2xl mb-3">Login</h1>
          <hr/>
          <hr/>
          {typeof lastResult?.error === "string" && (<p className="text-red-500 text-center mt-3">{lastResult?.error}</p>)}
          <form id={form.id} onSubmit={form.onSubmit} action={action}>
            <div className="mt-3">
              <label htmlFor="email" className="mb-2 block">Email</label>
              <input key={fields.email.key} name={fields.email.name} placeholder="example@example.com" className="border-2 w-full p-px shadow-md focus:outline-none focus:border-[#3795BD] rounded-md"/>
              <p className="text-red-500 text-xs">{fields.email.errors}</p>
            </div>
            <div className="mt-3">
              <label htmlFor="Password" className="mb-2 block ">Password</label>
              <input key={fields.password.key} name={fields.password.name} placeholder="*********" type="password" className="border-2 w-full p-px rounded-md shadow-md focus:outline-none focus:border-[#3795BD]"/>
              <p className="text-red-500 text-xs">{fields.password.errors}</p>
            </div>
            <div className="mt-4">
              <Link href={'/forgot-password'} className="text-[#3795BD] hover:text-black duration-150 font-semibold">Forgot Password?</Link> 
            </div>
            <div className="mt-4">
                <p className="text-[#3795BD]">Dont have account? <Link href={'/register'} className="underline duration-150 hover:text-black">Register.</Link></p> 
            </div>
            <div className="mt-5">
              <button type="submit" className="border-2 shadow-md text-white hover:-translate-y-1 active:translate-y-0 transform rounded-md px-2 py-1 duration-300 hover:bg-transparent hover:shadow-xl hover:text-black  bg-[#3795BD] w-full border-[#3795BD]">Login</button>
            </div>
            <div className="flex justify-between">
              <div className="mt-5 items">
                <GoogleSignInButton/>
              </div>
              <div className="mt-5">
                <GithubSigninButton/>
            </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}